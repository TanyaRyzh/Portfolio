const UserDao = require('../database/service/user_dao');
const passwordGenerator = require('password-generator');
const AuthService = require('./auth_service');
const NotifyRequest = require('../network/request/notification_request');
const redis = require('redis');

module.exports = class UserService {
  constructor(dbConfig, logger, defaultParams) {
    this._log = logger.getLogger('service/UserService');
    this._log.info('Start init user service');
    this._userDao = new UserDao(dbConfig, logger);
    this._dbConfig = dbConfig;
    this._defaultParams = defaultParams;
    this._redisClient = redis.createClient({
      host: this._defaultParams.redisConfig.host,
      port: this._defaultParams.redisConfig.port
    });
    this._redisChannel = this._defaultParams.redisConfig.channel;
    this._sendNotify = new NotifyRequest(dbConfig, logger, defaultParams);
    this._log.info('End init user service');
  }

  getUserWithPassword(body) {
    return new Promise((resolve, reject) => {
      if (!body.username || body.username.length < this._defaultParams.values.user.minSizeLogin
        || body.username.length > this._defaultParams.values.user.maxSizeLogin) {
        return reject(new Error(this._defaultParams.messages.error.usernameIncorrectFormat));
      }
      return this._userDao.getUserPasswordByEmail(body.username)
        .then((result) => {
          if (!result) {
            return resolve(false);
          }
          return resolve(result);
        })
        .catch(err => reject(err));
    });
  }

  getPhoneNumber(userInfo) {
    if (userInfo.details && userInfo.details.phoneNumber) {
      return userInfo.details.phoneNumber;
    } else if (/^\d+$/.test(userInfo.username)) {
      return userInfo.username;
    } else {
      return null;
    }
  }

  async getUserByLogin(login) {
    const user = await this._userDao.getUserByPhone(login);
    return user;
  }

  async changePassword(id, password) {
    try {
      let result = false;

      const user = await this._userDao.getById(id);
      if (user) {
        result = await this.update({ id, password });
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  checkUpdateSecurity(roleId, scope, info, dbConfig, userId, paramsId) {
    const superType = dbConfig.USER_TYPE.SUPER;
    const userType = dbConfig.USER_TYPE.USER;
    const options = info.options || {};
    const details = info.details || {};

    let hasSecurityFields = false;

    if ((roleId != superType && roleId != userType) || scope.indexOf('write') < 0) {
      return false;
    }

    this._defaultParams.values.securityFields.forEach(field => {
      if (info[field] !== undefined || options[field] !== undefined || details[field] !== undefined) {
        hasSecurityFields = true;
      }
    });

    if (hasSecurityFields && (roleId != superType || userId === paramsId)) {
      return false;
    }

    if (roleId == userType && userId !== paramsId) {
      return false;
    }

    return true;
  }

  checkInfoErrors(info) {
    const defaultValues = this._defaultParams.values.user;
    const errorMsgs = this._defaultParams.messages.error;

    let error;

    if (info.username && (info.username.length < defaultValues.minSizeLogin || info.username.length > defaultValues.maxSizeLogin)) {
      error = new Error(errorMsgs.usernameIncorrectFormat);
      error.status = 400;
      return error;
    }

    if (info.password && (info.password.length < defaultValues.minSizePassword || info.password.length > defaultValues.maxSizePassword)) {
      error = new Error(errorMsgs.passwordIncorrectFormat);
      error.status = 400;
      return error;
    }

    if (info.roleId && info.roleId < 1) {
      error = new Error(errorMsgs.roleIncorrectFormat);
      error.status = 400;
      return error;
    }

    if (info.statusId && info.statusId < 1) {
      error = new Error(errorMsgs.statusIncorrectFormat);
      error.status = 400;
      return error;
    }

    if (info.dealerId && info.dealerId < 1) {
      error = new Error(errorMsgs.dealerIncorrectFormat);
      error.status = 400;
      return error;
    }

    if (info.scope && info.scope.length <= 0) {
      error = new Error(errorMsgs.scopeIncorrectFormat);
      error.status = 400;
      return error;
    }

    return error;
  }

  async update(body) {
    try {
      const error = this.checkInfoErrors(body);
      if (error) {
        throw error;
      }

      if (body.password) {
        body.password = AuthService.hashPassword(body.password);
      }

      const updateResult = await this._userDao.updateUser(body);
      if (updateResult) {
        delete updateResult.password;
      }
      return updateResult;
    } catch (err) {
      throw err;
    }
  }

  getCountRows() {
    return new Promise((resolve, reject) => this._dbConfig.getFasterCountRows(this._userDao.getTableName())
      .then((result) => {
        if (!result) {
          return resolve(false);
        }
        return resolve(result);
      })
      .catch(err => reject(err)));
  }

  getUsers(data) {
    return new Promise((resolve, reject) => this._userDao.getAllUsers(data)
      .then((result) => {
        if (!result) {
          return resolve(false);
        }
        return resolve(result);
      })
      .catch(err => reject(err)));
  }

  async getCountCreatedUsers(startDate, endDate) {
    try {
      const count = await this._userDao.getCountCreatedUsers(startDate, endDate);

      return count;
    } catch (err) {
      throw err;
    }
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        const err = new Error(this._defaultParams.messages.error.isIsMissed);
        err.status = 400;
        return reject(err);
      }
      return this._userDao.getById(id)
        .then((result) => {
          if (!result) {
            return resolve(false);
          }
          return resolve(result);
        })
        .catch(err => reject(err));
    });
  }

  getSendParams(type) {
    const defaultParams = this._defaultParams;
    const messages = defaultParams.notifyProvider.messages.bahasaLang;
    const {
      notificationTypes,
      otpSendDelayTime,
      confCodeSendDelayTime,
      passwordSendDelayTime,
      maxSizePassword
    } = defaultParams.values;

    let notificationType;
    let code;
    let message;
    let delayTime;

    switch (type) {
      case 'one_time_password':
        notificationType = notificationTypes.oneTimePassword;
        code = passwordGenerator(4, false, /\d/);
        message = messages.oneTimePassword.replace('${code}', code);
        delayTime = otpSendDelayTime;
        break;
      case 'conf_code':
        notificationType = notificationTypes.confirmationCode;
        code = passwordGenerator(4, false, /\d/);
        message = messages.confirmationCode.replace('${code}', code);
        delayTime = confCodeSendDelayTime;
        break;
      case 'password':
        notificationType = notificationTypes.newPassword;
        code = passwordGenerator(maxSizePassword, false);
        message = messages.newPassword.replace('${password}', code);
        delayTime = passwordSendDelayTime;
        break;
      case 'numberConfirmation':
        notificationType = notificationTypes.numberConfirmation;
        code = passwordGenerator(4, false, /\d/);
        message = messages.confirmationCode.replace('${code}', code);
        delayTime = confCodeSendDelayTime;
        break;
      case 'tfaConfirmation':
        notificationType = notificationTypes.tfaConfirmation;
        code = passwordGenerator(4, false, /\d/);
        message = messages.confirmationCode.replace('${code}', code);
        delayTime = confCodeSendDelayTime;
        break;
    }

    return { notificationType, code, message, delayTime };
  }

  async checkDelayTime(type, phoneNumber, delayTime) {
    let lastNotification;

    try {
      lastNotification = await this._sendNotify.getLastVerifiableNotification({ phoneNumber, type });
    } catch (err) {
      this._log.error(err);
    }

    if (lastNotification && !lastNotification.was_used &&
      (new Date()).getTime() - lastNotification.created_at < delayTime * 1000) {
      const error = new Error(this._defaultParams.messages.error.delayTimeNotExpired);
      error.status = 403;
      throw error;
    }
  }

  async sendPasswordToUser(type, phoneNumber, smsNumber) {
    const defaultParams = this._defaultParams;
    let sendParams = this.getSendParams(type);

    if (type === 'one_time_password' || type === 'password') {
      const user = await this._userDao.getUserByPhone(phoneNumber);
      if (!user) {
        let error = new Error(defaultParams.messages.error.userNotFound);
        error.status = 400;
        throw error;
      }
    }

    await this.checkDelayTime(sendParams.notificationType, phoneNumber, sendParams.delayTime);

    if (smsNumber) {
      sendParams.message = `SMS #${smsNumber}. ` + sendParams.message;
    }

    const params = {
      username: phoneNumber,
      code: sendParams.code,
      message: sendParams.message,
      type: sendParams.notificationType,
      serviceId: defaultParams.notifyProvider.smsService,
    };

    return this._sendNotify.sendNotification(params);
  }

  verifySentPassword(grantType, phoneNumber, password) {
    const defaultValues = this._defaultParams.values;

    let type;
    let notificationExpires;

    if (grantType === 'one_time_password') {
      type = defaultValues.notificationTypes.oneTimePassword;
      notificationExpires = defaultValues.oneTimePasswordExpires;
    } else if (grantType === 'password') {
      type = defaultValues.notificationTypes.newPassword;
      notificationExpires = defaultValues.newPasswordExpires;
    } else if (grantType === 'conf_code') {
      type = defaultValues.notificationTypes.confirmationCode;
      notificationExpires = defaultValues.confirmationCodeExpires;
    } else if (grantType === 'conf_number_code') {
      type = defaultValues.notificationTypes.numberConfirmation;
      notificationExpires = defaultValues.confirmationCodeExpires;
    } else if (grantType === 'conf_tfa_code') {
      type = defaultValues.notificationTypes.tfaConfirmation;
      notificationExpires = defaultValues.confirmationCodeExpires;
    }

    return this._sendNotify.validateCode({
      phone: phoneNumber,
      code: password,
      type: type,
      notificationExpires: notificationExpires
    })
      .catch((err) => {

        this._log.error(err);
        return false;
      });
  }

  checkFailureAttempts(id) {
    return new Promise((resolve, reject) => {
      this._redisClient.get(`${this._redisChannel}:${this._defaultParams.messages.info.blockAttempts}:${id}`, (err, res) => {
        if (err) {
          reject(err);
        }

        let isTooManyAttempts = false;
        if (res) {
          const currentTimestamp = new Date().getTime();
          if (currentTimestamp - res < this._defaultParams.values.incorrectAttemptsDelay * 1000) {
            isTooManyAttempts = true;
          }
        }

        resolve(isTooManyAttempts);
      });
    });
  }

  resetFailureAttempts(id) {
    this._redisClient.set(`${this._redisChannel}:${this._defaultParams.messages.info.incorrectAttempts}:${id}`, '');

    return true;
  }

  addFailureAttempt(id) {
    return new Promise((resolve, reject) => {
      this._redisClient.get(`${this._redisChannel}:${this._defaultParams.messages.info.incorrectAttempts}:${id}`, (err, res) => {
        if (err) {
          reject(err);
        }

        const currentTimestamp = new Date().getTime();
        const interval = this._defaultParams.values.incorrectAttemptsInterval * 1000;

        const attempts = res ? res.toString().split(' ') : [];
        const attemptsArray = attempts.filter(timestamp => {
          return currentTimestamp - timestamp < interval;
        });

        attemptsArray.push(currentTimestamp);

        if (attemptsArray.length === this._defaultParams.values.maxIncorrectAttempts) {
          this._redisClient.set(`${this._redisChannel}:${this._defaultParams.messages.info.blockAttempts}:${id}`, currentTimestamp);
          this.resetFailureAttempts(id);
        } else {
          this._redisClient.set(`${this._redisChannel}:${this._defaultParams.messages.info.incorrectAttempts}:${id}`, attemptsArray.join(' '));
        }

        resolve(true);
      });
    });
  }
};
