# Dealer Panel: Implement agents list

#### Description

**Stakeholders:** Ivan G.

**Goals:** The dealer should have a website to manage his work.

Dealer panel should be in Bahasa.

**User Stories:**
1. As a dealer, I want to be able to open the dealer panel page so that I can manage my work.
1.1 Make a new website for dealer panel

2. As a dealer, I want to be able to login to the dealer panel with my login/password from my dealer agreement so that I can get into my panel.
2.1 Make markup
2.2 Make login

3. As a dealer, I want to be able to see the message if wrong or invalid credentials while login so that I can fix my login data.
3.1 Make markup
3.2 Make errors handling

4. As a dealer, I want to be able to see information for contacting CS if I forget my login/password so that I can get to know how to restore my login/password
4.1 Make markup

5. As a dealer, I want to be able to see a clear message about too many attempts to log in with an incorrect password (only 3 times per 2 minutes) so that I can wait and try again or contact CS
5.1 Make limitation for incorrect passwords for one login
5.2 Make error handling
5.3 Make markup

6. As a dealer, I want to be able to see my dealer referral code from dealer agreement so that I can copy and offer it to agents
6.1 Make a way to store dealers referral codes
6.2 Make API to get the dealer's referral code
6.3 Make markup

7. As an agent, I want to be able to input dealer referral code while registration so that I can be connected to the dealer after registration
7.1 Make a way to connect the new registered agent to the dealer by a referral code

8. As a dealer, I want to be able to see a list of my agents so that I can manage them.
8.1 Make markup
8.2 Make the place to store dealers with connected agents
8.3 Make API to get dealer's agents

9. As a dealer, I want to be able to start inviting an agent to my list so that I can extend my agents base
9.1 Make markup

10. As a dealer, I want to be able to stop inviting an agent to my list so that I can return to panel
10.1 Make markup

11. As a dealer, I want to be able to invite existed agent so that I can extend my agent base
11.1 Make markup
11.2 Make API to invite an existed agent to the dealer via SMS

12. As a dealer, I want to be able to invite new agent so that I can extend my agent base 
12.1 Make markup
12.2 Make a way to connect phone number on the unregistered agent to the dealer

13. As a dealer, I want to be able to see validation error if invalid phone number so that I can fix it 
13.1 Make error handling
13.2 Make markup

14. As a dealer, I want to be able to see a clear message if failed invitations so that I can try again or contact CS
14.1 Make error handling
14.2 Make markup

15. As a dealer, I want to be able to see a message about success so that I can understand that invitation is sent
15.1 Make markup

16. As a dealer, I want to be able to send 3000 invitations at all so that I can extend my agent base
16.1 Make a way to limit invitations from one dealer

17. As a dealer, I want to be able to see clear message about the limit of invitation so that I can contact CS to invite an agent
17.1 Make error handling
17.2 Make markup

18. As an existed agent, I want to get invitation link from a dealer via SMS message so that I can agree to connect to him
18.1 Make a way to send invitation from the dealer with a link via SMS

19. As an existed agent, I want to be connected to the dealer after going to his invitation link so that I can be connected to the dealer
19.1 Make a way to connect existed agent to the dealer

20. As a new agent, I want to be connected to the dealer after registration automatically if the dealer connected me before so that I can be connected to the dealer
20.1 Make a way to connect the new agent to the dealer

21. As a dealer, I want to be able to see the agent's information: id, name, phone number, email, address, a total margin so that I can recognize them
21.1 Make the place to store all the necessary information 

22. As a dealer, I want to be able to delete agent with confirmation from the list so that I can manage my agent base.
22.1 Make markup
22.2 Make API to disconnect agent from the dealer and connect to default dealer (easypay)

23. As a dealer, I want to be able to see an error if failed deleting from the list so that I can try again or contact CS.
23.1 Make error handling at a front end

24. As a dealer, I want to be able to see a message if success so that I can understand that agent is deleted
24.1 Make markup

25. As a dealer, I want to be able to top-up balances for my every agent so that I can manage agents work
25.1 Make markup 
25.2 Make API for top-up agents from the dealer

26. As a dealer, I want to be able to fill the sum of top up for an agent so that I can manage agent balance.
26.1 Make markup 

27. As a dealer, I want to be able to see validation error if incorrect data so that I can fix it
27.1 Make data validation at the front end

28. As a dealer, I want to be able to see an error if failed top up so that I can try again or contact CS.
28.1 Make error handling at the front end

29. As a dealer, I want to be able to see a message if success so that I can understand that top-up is done.
29.1 Make markup

30. As a dealer, I want to be able to stop top up for an agent so that I can return to agents managing.
30.1 Make markup

~~31. As a dealer, I want to be able to see a message about a top-up request from an agent so that I can top-up his balance
31.1 Make the notification in Whatsapp about top-up~~

32. As a dealer, I want to be able to see loading indicator while data loading so that I can understand that my data is loading
32.1 Make markup

33. As a dealer, I want to be able to sort agents by all information columns so that I can quickly find information
33.1 Make markup

34. As a dealer, I want to be able to get some margin from my agents' transactions so that I can get revenue from agents
34.1 Make a getting margin from agents transactions connected to the dealer

35. As a dealer, I want to be able to see my balance so that I can get to know about the state of my balance
35.1 Make a way to get dealer balance
35.1 Make markup

36. As an agent, I want to be able to accept another invitation link so that I can change my dealer
36.1 Make API to invite an existed agent to the dealer via SMS

37. As a dealer, I want to be able to see an error while top-up if sum is less than my balance so that I can fix the sum or add money to balance
37.1 Add error handling
37.2 Make markup

38. As a dealer, I want to be able to logout so that I can change another account
38.1 Make a way to logout dealer
38.2 Make markup

**Acceptance Criteria & Tests:**

| ID | Criteria | Tests |
|:---:|---|---|
| 1 | Display the web-site for dealer panel | **1.** Go to dealer panel web-site  **2.** See the website | 
| 2 | Capability to login | **1.** Go to dealer panel **2.** Input dealer login/password **3.** Login |
| 3 | Display error while login if incorrect credentials | **1.** Go to dealer panel **2.** Input incorrect credentials **3.** See the error |
| 4 | Display error while login if invalid credentials | **1.** Go to dealer panel **2.** Input invalid credentials **3.** See the validation error |
| 5 | Display information if an agent forget login/password | **1.** Go to dealer panel **2.** See the information |
| 6 | Display error of too many attempts | **1.** Go to dealer panel **2.** Input 3 incorrect passwords in 2 minutes **3.** See an error |
| 7 | Display the list of agents | **1.** Login to dealer panel **2.** See the list of agents |
| | | **1.** Login to dealer panel **2.** See the list of agents  **3.** Choose another section  **4.** Choose the list of agents section  **5.** See the list of agents | 
| 8 | Capability to start inviting an agent | **1.** Login to dealer panel  **2.** See the list of agents  **3.** See the capability to start inviting an agent  | 
| 9 | Display the form of inviting an agent | **1.** Login to dealer panel **2.** Start invitation of an agent  **3.** See the input form for phone number and capability to invite the agent  **4.** Don't see the capability to save an agent without filled phone number |
| 10 | Capability to stop invitation an agent | **1.** Login to dealer panel  **2.** Start invitation of an agent  **3.** See the capability to close invitation form  **4.** Close the form  **5.** See the list of agents  | 
| 11 | Display data about existed user after phone number input | **1.** Login to dealer panel  **2.** Start adding an agent  **3.** Input in phone number field the number of existed agent  **4.** After input see the loading indicator  **5.** See the information about existed agent |
| 12 | Capability to invite agent | **1.** Login to dealer panel  **2.** Start adding an agent  **3.** Input the phone number of existed agent  **4.** After input see the loading indicator  **5.** See the information about existed agent  **6.** See the way to invite an agent |
| | | **1.** Login to dealer panel  **2.** Start adding an agent  **3.** Input the phone number of new agent  **4.** See the information that it's new agent  **5.** See the way to invite an agent |
| 13 | Display validation error if invalid phone number | **1.** Login to dealer panel  **2.** Start invitation of an agent  **3.** Input invalid phone number  **4.** See validation error |
| 14 | Get SMS message with invitation | **1.** Login to dealer panel  **2.** Start invitation of agent  **3.** Input phone number of existed agent  **4.** Invite **5.** Check the SMS message for this phone number |
| 15 | Capability to connect agent to dealer via invitation link |  **1.** Go to dealer panel  **2.** Start invitation of agent  **3.** Input phone number of existed agent  **4.** Invite  **5.** See the link in SMS message for this phone number  **6.** Go to link  **7.** Go to list of agents in dealer panel **8.** See this agent in the list |
| | |  **1.** Go to dealer panel  **2.** Start invitation of agent  **3.** Input phone number of new agent  **4.** Invite  **5.** Register in mobile app like an agent with this phone number  **6.** Go to list of agents in dealer panel **7.** See this agent in the list |
| 16 | Capability to start deleting an agent | **1.** Login to dealer panel **2.** See the way to delete each agent |
| 17 | Display confirmation of deleting agent | **1.** Login to dealer panel **2.** Start deleting agent  **3.** See confirmation of deleting with data about agent and capability to delete or cancel this action |
| 18 | Capability to stop deleting  | **1.** Login to dealer panel **2.** Start deleting agent  **3.** See confirmation  **4.** See capability to close confirmation form  **5.** Close it **6.** See the list of agent without changes |
| 19 | Capability to delete agent after confirmation | **1.** Login to dealer panel **2.** Start deleting agent  **3.** See confirmation  **4.** Confirm deleting  **5.** See the list of agents exclude deleted agent |
| 20 | Display error if failed deleting of agent | **1.** Login to dealer panel  **2.** Start deleting agent  **3.** See the confirmation  **4.** Confirm deleting  **5.** See an error if server problems |
| 21 | Capability to start top up balance for each agent | **1.** Login to dealer panel  **2.** See the way to start top up for each agent |
| 22 | Display the form for filling information after start top up for agent | **1.** Login to dealer panel  **2.** Start top up for agent  **3.** See the form with sum field |
| 23 | Display validation error while filling incorrect data for top up | **1.** Login to dealer panel  **2.** Start top up for agent  **3.** Input incorrect data in sum field  **4.** See validation error |
| 24 | Capability to top up balance of agent | **1.** Login to dealer panel  **2.** Start top up for agent  **3.** Input correct sum  **4.** See the way to save data  **5.** Save information  **6.** See the list of agents |
| 25 | Display Whatsapp message about top-up request | **1.** Login to WebPOS (like an agent)  **2.** Go to Riyawat Transaksi **3.** Choose top-up request section  **4.** Request top-up  **5.** See the message about top-up request in dealer's Whatsapp |
| 26 | Display loading indicator while data loading | **1.** Login to dealer panel **2.** See loading indicator while data loading |
|  |  | **1.** Login to dealer panel  **2.** Start invitation existed agent  **3.** Input phone number of existed agent **4.** See loading indicator |
|  |  | **1.** Login to dealer panel  **2.** Start invitation an agent  **3.** Input phone number **4.** Invite  **5.** See loading indicator |
|  |  | **1.** Login to dealer panel  **2.** Start deleting of agent  **3.** Confirm deleting **4.** See loading indicator |
|  |  | **1.** Login to dealer panel  **2.** Start top-up of agent  **3.** Input correct sum **4.** Click save **5.** See loading indicator |
| 27 | Capability to sort the list of agents | **1.** Login to dealer panel  **2.** See the list of agents  **3.** Sort the list by any data field  **4.** See the sorted data |
| 28 | Capability to assign agents to dealer by referral code | **1.** Register at mobile app like agent **2.** Input referral code of dealer **3.** Go to dealer panel **4.** See this agent in agents list |
| 29 | Capability to margin from agents' transactions | **1.** Make a transaction like an agent **2.** Go to dealer panel **3.** See that total margin is increased for this agent |
| 30 | Display dealer balance | **1.** Login to dealer panel **2.** See the balance |
| 31 | Capability to change dealer | **1.** Accept invitation like existed agent **2.** Accept another invitation **3.** Be connected to dealer from last invitation |
| | | **1.** Accept invitation like unregistered agent **2.** Accept another invitation **3.** Register in mobile app **4.** Be connected to dealer from last invitation |
| 32 | Display error while incorrect topup sum | **1.** Go to dealer panel **2.** Start topup **3.** Input sum more that balance **4.** See an error|
#### Additional
| 33 | Capability to logout | **1.** Login to dealer panel **2.** Logout **3.** Login to dealer panel |

#### Additional

1. Data format

| Data field | Type | Validation rules | Example |
|---|:---:|---|---|
| Login | String | 3-64 symbols | testUser |
| Password | String | 6-16 symbols | testPassword123 |
| Phone number | String | 08 + 9-11 symbols or 628 + 9-11 symbols | 081122334455, 6281258963524 |

2. Texts for validation errors

| Data field | Type of error | English | Bahasa |
|---|---|---|---|
| Login | Incorrect format | This field must contain 3-64 symbols | Kolom ini wajib berisi 3-64 karakter |
| | Missed field | This field is required | Kolom ini bersifat wajib |
| | Login not found | No dealers with this login | Tidak ada Dealer dengan data login ini |
| Password | Incorrect format | This field must contain 6-16 symbols | Kolom ini wajib berisi 6-16 karakter |
| | Missed field | This field is required | Kolom ini bersifat wajib |
| | Incorrect password | Incorrect password | Password salah |
| Phone number | Incorrect format | This field must contain only numbers, start from 08 or 628,  have 9-15 symbols | Kolom ini hanya dapat diisi dengan angka, dari 8-628, terdiri atas 9-15 karakter |

3. Texts if forgot login/password
English: "You can see your login/password in your dealer agreement or contact CS."
Bahasa: "Anda dapat melihat login/password Anda di Perjanjian Kerja Sama atau hubungi CS"

4. Texts for error if too many login attempts
English: "Too many attempts. Please wait and try again." 
Bahasa: "Batas percobaan tercapai. Mohon tunggu dan coba lagi."

5. Texts for error while agent invitation
English: "Error while inviting, please, try again, or contact CS by the phone number: 08001003279"
Bahasa: "Gangguan dalam undangan, mohon coba lagi atau hubungi CS di 08001003279 (bebas pulsa)"

6. Texts for error if limit invitations
English: "You've used all your invitations. Please contact CS."
Bahasa: "Anda telah menggunakan seluruh undangan Anda. Mohon hubungi CS."

7. Texts for success invitation
English: "The agent with a number [phone number] is invited"
Bahasa: "Agen dengan nomor [no telp] telah terundang"

8. Texts for success deleting
English: "The agent with a number [phone number] is deleted"
Bahasa: "Agen dengan nomor [no telp] telah dihapus"

9. Texts for invitations
English: "Dealer [name, phone number] invitation: [link]"
Bahasa: "Undangan Dealer [name, phone number]: [tautan]"

10. Texts for error while agent deleting
English: "Error while deleting, please, try again, or contact CS by the phone number: 08001003279"
Bahasa: "Gangguan dalam penghapusan, mohon coba lagi atau hubungi CS di 08001003279 (bebas pulsa)"

11. Data format for top-up

| Data field | Is required | Type | Validation rules | Example |
|---|:---:|:---:|---|---|
| Sum | Yes | Number | a multiple of 1000, min = 1000, no max  | 100000 |

12. Texts for validation errors while top-up
English: "The sum must be multiple of 1000, the minimum value is Rp 1000"
Bahasa: "Jumlah harus merupakan kelipatan dari 1000, dengan jumlah minimum Rp 1.000"

12. Texts for success topup:
English: "Top up for agent [Phone number] on Rp [Sum]"
Bahasa: "Penambahan saldo untuk agen [no telp] on Rp [total]"

13. Texts for topup request:
English: "This agent [agent name], [phone number] requests balance top up by Rp [sum]"
Bahasa: "Agen [nama agen], [no telp] meminta penambahan saldo sejumlah Rp [total]"

14. Texts for error while top-up

| Type of error | English | Bahasa |
|---|---|---|
| Not enough money | There is not enough money at your balance | Maaf, saldo Anda tidak cukup |
| Unexpected error | Error while top-up, please, try again, or contact CS by the phone number: 08001003279 | Gangguan dalam penambahan saldo, mohon coba lagi atau hubungi CS di 08001003279 (bebas pulsa) |

15. Texts for UI elements:

| UI element | English | Bahasa |
|---|---|---|
| Data field | Username | Username |
| Data field | Password | Password |
| Text | Forgot Password? | Lupa Password? |
| Text | Hi, Welcome Back! | Hai, Selamat Datang Kembali! |
| Text | Balance: | Saldo: |
| Button | Logout | Logout |
| Text | Referral Code: | Kode Referal: |
| Text | Show [count] entries | Tampilkan [count] data |
| Text | Showing [start row] to [end row] of [total] entries | Menampilkan [start row-end row] dari [count] data |
| Button | Next | Selanjutnya |
| Button | Prev | Sebelumnya |
| Section | Agents | Agen |
| Section | Report Panel | Panel Laporan |
| Button | Invite Agent | Undang Agen |
| Button | Import from .xls | Pindahkan dari .xls |
| Data field | ID | ID |
| Data field | Phone number | No Telp |
| Text | Enter Phone Number | Masukan No Telp |
| Data field | Address | Alamat |
| Data field | Email |  Email |
| Data field | Total margin | Total margin  |
| Button | Top Up | Tambah Saldo |
| Text | Enter Amount: | Masukan Jumlah |
| Button | Delete | Hapus |
| Text | Loading... | Loading... |
| Button | Cancel | Batalkan | 
| Button | Invite | Mengundang |
| Text | Are you sure to delete this agent? | Apakah Anda yakin untuk menghapus Agen ini? |
| Text | Amount | Jumlah |
| Text | Date | Tanggal |

16. Dealer rewards

| Description | Reward |
|---|---|
| IDR per transaction 5K | 60 |
| IDR per transaction 10K | 100 |
| IDR per transaction 10<100K |  125 |
| IDR per transaction >100K | 200 |
| For PLN | 50 |
| Post Paid |  50 |