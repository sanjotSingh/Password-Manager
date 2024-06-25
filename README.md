Password manager to store sitename, user credentials and more.


Tech Stack: Node.js and MongoDB.

Setup:
Downloads: Node.js and MongoDB
Intall Dependencies: ```npm install ```
Run Backend: ```node server.js```

The frontend is plain HTML and can be run by simply opening the html file.

Note: This password manager is intended to run on Niagara Tridium workbench. As such the authentication and security is also handled by the N4 Workbench.

Environment variables (.env file): You must create a .env file and populate the following environment variables.
MONGODB_URI
ENCRYPTION_KEY
PRIVATE_KEY
CERTIFICATE
