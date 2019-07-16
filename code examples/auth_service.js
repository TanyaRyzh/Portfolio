const UserDao = require('../database/service/user_dao');
const AuthDao = require('../database/service/auth_dao');
const UserDeviceDao = require('../database/service/user_device_dao');
const NotifyRequest = require('../network/request/notification_request');
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
const FacebookRequest = require('../network/request/facebook_request');

module.exports = class AuthService {
  constructor(dbConfig, logger, defaultParams) {
    this._log = logger.getLogger('service/AuthService');
    this._log.info('Start init auth service');
    this._userDao = new UserDao(dbConfig, logger);
    this._authDao = new AuthDao(dbConfig, logger);
    this._deviceDao = new UserDeviceDao(dbConfig, logger);
    this._fbRequest = new FacebookRequest(logger);
    this._defaultParams = defaultParams;
    this._sendNotify = new NotifyRequest(dbConfig, logger, defaultParams);
    this._log.info('End init auth service');
  }

  async checkInfoErrors(info) {
    const defaultInfo = this._defaultParams.values.user;
    const defaultError = this._defaultParams.messages.error;
    const username = info.username;
    const phoneNumber = info.details && info.details.phoneNumber;

    const invalidLogin = !username || username.length < defaultInfo.minSizeLogin || username.length > defaultInfo.maxSizeLogin;
    const invalidPassword = !info.password || info.password.length < defaultInfo.minSizePassword || info.password.length > defaultInfo.maxSizePassword;
    const invalidName = !info.name;

    let error;

    if (invalidLogin || invalidPassword || invalidName) {
      let errorName = invalidLogin ? defaultError.usernameIncorrectFormat : (invalidPassword ? defaultError.passwordIncorrectFormat : defaultError.nameIsMissed);
      error = new Error(errorName);
      error.status = 400;
      return error;
    }

    if (info.token_provider_info) {
      let user = await this._userDao.getUserByAuthProviderId(info.token_provider_info.id);
      if (user) {
        error = new Error(defaultError.usernameExists);
        error.status = 403;
        return error;
      }
    }

    let user = await this._userDao.getUserByEmail(username);
    if (user) {
      error = new Error(defaultError.usernameExists);
      error.status = 403;
      return error;
    }

    if (phoneNumber) {
      let user = await this._userDao.getUserByPhone(phoneNumber);
      if (user) {
        error = new Error(defaultError.phoneNumberExists);
        error.status = 403;
        return error;
      }
    }

    return error;
  }

  processInfo(info) {
    const defaultInfo = this._defaultParams.values.user;

    if (!info.options || !(typeof info.options === 'object' && info.options.constructor === Object)) {
      info.options = {};
    }
    if (typeof (info.options.twoFactorAuth) !== 'boolean') {
      info.options.twoFactorAuth = defaultInfo.options.twoFactorAuth;
    }

    if (!info.details || !(typeof info.details === 'object' && info.details.constructor === Object)) {
      info.details = {};
    }
    if (!info.details.phoneNumber && /^\d+$/.test(info.username)) {
      info.details.phoneNumber = info.username;
    }

    info.scope = info.scope || defaultInfo.scopes;
    info.roleId = info.roleId > defaultInfo.roleId ? info.roleId : defaultInfo.roleId;
    info.policy = info.policy || defaultInfo.defaultPolicy;
    info.password = AuthService.hashPassword(info.password);

    if (!info.statusId || info.statusId < 1) {
      info.statusId = defaultInfo.status;
    }
    if (!info.dealerId || info.dealerId < 1) {
      info.dealerId = defaultInfo.dealer;
    }

    return info;
  }

  async processFacebookInfo(info) {
    const tokenInfo = info.token;
    let result = info;

    if (tokenInfo && tokenInfo.token && tokenInfo.service === 'fb') {
      const fbInfo = await this._fbRequest.getTokenInfoFromFacebook(tokenInfo.token, tokenInfo.secret, tokenInfo.id);
      if (fbInfo) {
        result.token_provider_info = fbInfo;
        result.name = result.name || fbInfo.name;
      }
    }

    return result;
  }

  async signup(body) {
    const info = await this.processFacebookInfo(body);

    const error = await this.checkInfoErrors(info);
    if (error) {
      throw error;
    }

    const processedInfo = this.processInfo(info);
    let result = await this._userDao.addUser(processedInfo);

    if (result) {
      // result.dataValues.login = result.username;
      // delete result.dataValues.username;

      delete result.dataValues.password;
      delete result.dataValues.created_at;
      delete result.dataValues.updated_at;
    } else {
      result = false;
    }

    return result;
  }

  getUserFromToken(token) {
    return this._fbRequest.getTokenInfoFromFacebook(token)
      .then(info => this._userDao.getUserByAuthProviderId(info.id));
  }

  refreshToken(data) {
    return new Promise((resolve, reject) => this._authDao.findTokenByRefreshToken(data.refreshToken, new Date().getTime())
      .then((result) => {
        if (!result) {
          const err = new Error(this._defaultParams.messages.error.refreshTokenNotFoundOrExpired);
          err.status = 401;
          return reject(err);
        }

        const client = result.dataValues.oauth_token_client;
        const user = result.dataValues.oauth_token_user;
        const expires = new Date().getTime();
        const accessToken = AuthService.hashPassword(`${client.client_id}:${uuidV4()}:${new Date().getTime()}`);
        const accessExpires = new Date(expires + this._defaultParams.values.accessExpires);
        const token = {
          id: result.dataValues.id,
          accessToken,
          accessExpires,
        };

        // this._log.info(client);

        return this._authDao.updateToken(token)
          .then((result) => {
            if (!result) {
              const err = new Error(this._defaultParams.messages.error.refreshTokenNotFoundOrExpired);
              err.status = 401;
              return reject(err);
            }
            const response = {};
            response.expires_in = accessExpires.getTime();
            response.access_token = accessToken;
            response.refresh_token = data.refreshToken;
            response.user_id = user.id;
            response.token_type = this._defaultParams.values.tokenType;
            return resolve(response);
          })
          .catch((err) => {
            this._log.error(err);
            err.status = 500;
            return reject(err);
          });
      })
      .catch(err => reject(err)));
  }

  getAccessTokenByToken(accessToken) {
    return new Promise((resolve, reject) => {
      if (!accessToken) {
        const error = new Error(this._defaultParams.messages.error.accessTokenIsMissed);
        error.status = 400;
        return reject(error);
      }
      return this._authDao.getAccessToken(accessToken)
        .then((result) => {
          if (!result) {
            return resolve(false);
          }
          result.dataValues.token_type = this._defaultParams.values.tokenType;
          result.dataValues.user = result.dataValues.oauth_token_user;
          delete result.dataValues.oauth_token_user;
          return resolve(result);
        })
        .catch((err) => {
          this._log.error(err);
          return reject(err);
        });
    });
  }

  verifyPassword(password, hash) {
    return bcrypt.compare(password, hash)
      .then((result) => {
        if (result) {
          return Promise.resolve(true);
        }
      })
      .catch((err) => {
        this._log.error(err);
        return Promise.reject(err);
      });
  }

  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }

  removeUserTokens(userId) {
    return new Promise((resolve, reject) => this._authDao.removeUserTokensById(userId)
      .then((result) => {
        if (!result) {
          return resolve(false);
        }
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      }));
  }

  async saveAccessToken(client, user, scope) {
    try {
      const checkScopes = this.checkScopes(user.scope, scope);
      if (checkScopes instanceof Error) {
        throw checkScopes;
      }

      const expires = new Date().getTime();
      const accessToken = AuthService.hashPassword(`${client.dataValues.clientId}:${uuidV4()}:${new Date().getTime()}`);
      const refreshToken = AuthService.hashPassword(`${client.dataValues.clientId}:${uuidV4()}:${new Date().getTime()}`);
      const accessExpires = new Date(expires + this._defaultParams.values.accessExpires);
      const refreshExpires = new Date(expires + this._defaultParams.values.refreshExpires);
      const token = {
        accessToken,
        refreshToken,
        accessExpires,
        refreshExpires,
      };

      this._log.info(client);
      const result = await this._authDao.saveToken(token, client, user);
      if (result) {
        result.dataValues.expires_in = result.access_token_expires_at;

        delete result.dataValues.access_token_expires_at;
        delete result.dataValues.refresh_token_expires_at;
        delete result.dataValues.client_id;
        delete result.dataValues.id;
        delete result.dataValues.created_at;
        delete result.dataValues.updated_at;
        result.dataValues.token_type = this._defaultParams.values.tokenType;
      }

      return result;
    } catch (err) {
      this._log.error(err);
      throw err;
    }
  }

  async getAccessToken(client, user, scope) {
    try {
      const resultToken = await this._authDao.findTokenByParams(client.dataValues.clientId, user.id, new Date().getTime());

      if (resultToken) {
        resultToken.dataValues.token_type = this._defaultParams.values.tokenType;
        return resultToken;
      }

      const savedToken = await this.saveAccessToken(client, user, scope);
      return savedToken;
    } catch (err) {
      this._log.error(err);
      throw err;
    }
  }


  checkScopes(mainScopes, authScopes) {
    for (let i = authScopes.length; i--;) {
      if (mainScopes.indexOf(authScopes[i]) < 0) {
        const error = new Error(`${this._defaultParams.messages.error.scopeIsIncorect}: ${authScopes[i]}`);
        error.status = 400;
        return error;
      }
    }

    return true;
  }

  async sendSuccessLogin(userId, phoneNumber, device) {
    try {
      const devices = await this._deviceDao.getByUserId(userId);
      let knownDevices;

      if (devices && devices.length) {
        knownDevices = devices.find(item => {
          return item.fingerprint === device;
        });
      }

      if (!knownDevices) {
        await this._deviceDao.addByUserId(userId, device);

        const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
        const params = {
          username: phoneNumber,
          message: this._defaultParams.notifyProvider.messages.bahasaLang.successLogin.replace('${date}', date),
          serviceId: this._defaultParams.notifyProvider.smsService
        };
        return true;
        //return this._sendNotify.sendNotification(params);
      }
    } catch (err) {
      throw err;
    }
  }
};
