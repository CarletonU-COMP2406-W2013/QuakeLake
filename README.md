ENDLESS BATTLES

by QuakeLake

Rafael Guerra - student number
and
Sébastien Ouellet - 100836987

DESCRIPTION

Tactical turn-based multiplayer game that would look like how the combat plays out in Chess, if pieces had health and special abilities.
One player will control a team of heroes and the other player will control a number of monsters that the first player must defeat. The players move their characters on a grid, and each character have a number of actions available per turn, such as a move action or an attack action. Initially, players decide where to put their characters on the grid, based on a budget, as there is a cost associated with each of the characters.

The web server runs the game logic and send updates to the clients, and the clients display the graphics and process the input from the players and send those inputs to the server. Given the nature of the game, all input is done through clicks, so the position of the two last clicks are sent. Communication between the clients and the server is done through sockets, provided by Socket.IO. The backend store stores the information of the users, including their username, their password, and the number of victories they had. A global leaderboard is produced for that last number.

HOW TO RUN

Start a mongodb instance.

Start the server by running:

node app.js

Everything should then work as expected. 
It's running on Node.js, Express, Socket.IO, MongoDB, bcrypt, cookie, jade, and stylus. JQuery is also used on the client side.
