Password manager to store sitename, user credentials and more.



## Tech Stack:
Node.js
MongoDB

## Setup:
**First Download Node.js and MongoDB**

Run the following commands in the root folder:
Install Dependencies: ```npm install ```
Run Backend: ```node server.js```

The frontend is plain HTML and can be run by simply opening the html file.

Note: This password manager is intended to run on Niagara Tridium workbench. As such the authentication and security is also handled by the N4 Workbench.

## Environment variables (.env file): 
You must create a .env file and populate the following environment variables.
```sh
MONGODB_URI = "mongodb://localhost:2000/password_manager"
ENCRYPTION_KEY = "key"
PRIVATE_KEY = "private Key for ssl/tls"
CERTIFICATE = "Certificate tof ssl/tls"
