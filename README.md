# Release Management Tool
## Intro

* Release Management Tool is a web application developed using **Node.js (Express, Express-NTLM, Mongoose, EJS), HTML, Bootstrap, CSS, Javascript** and **MongoDb**. 
* The application aims to provide a unified platform to keep a record of releases by facilitating the tracking of operations performed on the releases. 
* Another key feature of the application is to identify the "Coinciding Releases" so that the user(s) can pay special attention to them in order to avoid release failure/multiple rollbacks. This is achived through the **MongoDb aggregate** function.
* The tool also keeps a history of all the actions being performed in a separate database so that user activity can be traced if needed. 
 
  ![index](/ss/index.JPG)
 
 ## New Release
 Create a new release entry in the database by providing basic details like the Release Number, Customer, Module, Status and an optional description.
 
 ![new](/ss/new.JPG)
 
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
 
 ![coinciding_releases](/ss/coinciding_releases.JPG)
 
## History
 
 ![release_history](/ss/release_history.jpg)
 
## Configuration
 
 ![config](/ss/config.JPG)
 ![config2](/ss/config2.jpg)
 
