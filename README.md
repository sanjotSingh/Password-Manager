Password manager to store sitename, user credentials and more.

## Tech Stack:
Niagara N4 Workbench (apache server running a jetty web server)
Node.js
MongoDB

## Node Setup:
**First Download Node.js and MongoDB**

Run the following commands in the root folder:

Install Dependencies: ```npm install ```

set up for prod: ```npm install pm2@latest -g'''

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
```

## Communication pipeline
All http requests flow through Niagara workbech. The webpage communicates with Niagara using Bajascript. The niagara workbench sends HTTP requests to the node server using the java program blocks. The node API communicates with the database and encrypts/decrypts incoming/oitgoing data.