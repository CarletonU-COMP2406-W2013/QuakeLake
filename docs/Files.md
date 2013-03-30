Files

public\
Client-side files

public\graphics\
Game's images

public\graphics\archer.png
Archer's image

public\graphics\blue.png
Blue's image

public\graphics\cube.png
Cube's image

public\graphics\flying.png
Flying demon's image

public\graphics\goblin.png
Goblin's image

public\graphics\grass.png
Grass' image

public\graphics\healer.png
Healer's image

public\graphics\heavy.png
Heavy Demon's image

public\graphics\mage.png
Mage's image

public\graphics\warrior.png
Warrior's image

public\javascripts\
Client-side javascript

public\javascripts\chatting.js
Implementation of the Chat screen using Socket.io

public\javascripts\clientCharacters.js
//I dont know

public\javascripts\clientGame.js
//I dont know

public\stylesheets\
CSS and Stylus files

public\stylesheets\style
CSS file generate by Stylus

public\stylesheets\style.styl
Stylus file that define CSS file

routes\
These files create the routing scheme to get a page for the client

routes\chat.js
Routing for the chat page
 
routes\game.js
Routing for the game page

routes\index.js
Routing for the home page

routes\leaderboard.js
Routing for the Leaderboard page

routes\profile.js
Routing for the User's profile page

routes\signup.ja
Routing for the Sign Up page

views\
Template for Jade

views\chat.jade
Template for chat page

views\game.jade
Template for Game page

views\index.jade
Template for Home page

views\layout.jade
Main template

views\leaderboard.jade
Template for the leaderboard page

views\password.jade
Template for the Change password page

views\profile.jade
Template for the Profile page

views\signup.jade
Template for the Sign Up page

app.js: 
It is the core of the application. It is used to handle posts and gets.
This file also handles the Socket.IO connections used to update the state of the games running on the server (from player input) and the graphics seen by the players.

package.json
It lists the project dependencies and some metadata for npm

serverCharacter.js
It contains the Object information about each character.
 
serverGame.js
It contains the Object information of each game.
