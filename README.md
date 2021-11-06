# Release Management Tool
## Intro

* Release Management Tool is a web application developed using **Node.js (Express.js, Express-NTLM, Mongoose, EJS), HTML, Bootstrap, CSS, Javascript** and **MongoDb**. 
* The application aims to provide a unified platform to keep a record of releases by facilitating the tracking of operations performed on the releases. 
* Another key feature of the application is to identify the "Coinciding Releases" so that the user(s) can pay special attention to them in order to avoid release failure/multiple rollbacks. This is achieved through the **MongoDb aggregate** function.
* User identification (not validation) is achieved via Express-NTLM.
* The tool also keeps a history of all the actions being performed in a separate database so that user activity can be traced if needed. 
 
  ![index](/ss/index.JPG)
 
 ## New Release
 Create a new release entry in the database by providing basic details like the Release Number, Customer, Module, Status and an optional description.
 
 ![new](/ss/new.JPG)
 
 ## View
 View the details of any specific release along with it's past history like who modified it, what changes were made, when were these changes made.
 
 ![details](/ss/details.jpg)
 
 ## Search
 Use the advanced search filters to search for specific release(s) in the database.
 
 ![search](/ss/advanced_search.JPG)
 
 ## Coinciding Releases
 Identify the coinciding releases so that further action can be taken.
 
 Q: What is considered as a coinciding release?
 
 A release is said to be coinciding/conflicting with other release(s) if it:
 1. Belongs to the same customer
 2. Belongs to the same module
 3. Has an unstable status
 For example: Two releases say REL456 and REL222 belonging to the same customer(Customer 2) and the same module(Module 2) are coinciding because they are having unstable statuses(UNDER_TESTING and ROLLING_BACK respectively). The statuses can be configured in the "Config" tab of the tool.
 
 THE LOGIC: The logic here is that it is very likely that some of the files/components of a release under testing might be shared with some other release which is under testing or is being rolled back leading to conflict. Whereas if a release is DEPLOYED or ROLLED_BACK (stable statuses), it has no affect on rest of the releases.
 
 ![coinciding_releases](/ss/coinciding_releases.JPG)
 
## History
View the what all actions were performed on all the releases.
 
 ![release_history](/ss/release_history.jpg)
 
## Configuration
 Configure the tool with an option to add/remove statuses and mark them as a complete state (stable status). Also, get an option to delete the release history.
 Since this section involves tool configuration, it is protected by a passkey.
 The default passkey is 'admin123' with an option to reset the same.
 
 ![config](/ss/config.JPG)
 ![config2](/ss/config2.jpg)
 
 ## Installation
 1. Install Node.js(v14.17.5) and MongoDb(v5.0.2)
 2. Install all the dependencies from  package.json (npm install module_name) in the main directory. This will make a "node_modules" directory in the main directory containing all the required modules.
 3. After configuring MongoDb, run MongoDb daemon (mongod).
 4. Execute index.js (node index.js).
 5. On the first launch, go to "Config" tab, use the default passkey "admin123" to add the statuses as per your requirement (UNDER_TESTING, DEPLOYED, ROLLING_BACK, ROLLED_BACK etc).
 6. Enjoy the application :)
