Dependencies.md

Express:

It is a web application framework for node.js. 
Here, it is used to run the application.
License: MIT license 

MongoDB:

It is an open-source, document-oriented database designed for ease development and scaling.
MongoDB was used to store the user information, like Name, username, password and number of Victories on the game.
License: GNU AGPL v3.0

bcrypt:

It is a library to hash passwords using the bcrypt algorithm.
It is used to store the hash version of user's password.
License: https://github.com/ncb000gt/node.bcrypt.js/blob/master/LICENSE

Jade:

Jade is a high perfomances template engine for node.js.
It is use to create HTML templates.
License: MIT License

Socket.IO:

It is a cross-browser WebSocket for realtime apps.
The main server listens for connections, and once they are established, messages are exchanged between the clients and the server to update the state of the chat page (which is global) and the game page (which is restricted to the two clients competing against each other).
License:MIT License 

Stylus: 

Dynamic CSS Library. We use the default stylesheets produced by the Express framework.
