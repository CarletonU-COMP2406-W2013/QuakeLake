Extensions

- Save the game state

The current version does not save the game state, so if one player lost his connection, he won't be able to continue the game.
To implement this feature, we could save all game information on the database. So, the game could work as real-time application and, also, for players
that does not have enough time to play a entire game.

- Add Social Network features

Add Friends to your profile, create a leaderboard between your friends. It could be implemented by adding more information to the database and change a few things in how the profile are show.

- Create a window for room selection

For the moment, only a Quick Start option is available, where a user will automatically join a game if he goes on the Game page and a game is waiting for players. Offering the player to create a game and make it private for a friend, and to see a list of available games, would simplify the way friends can play a game together.
The current design stores the game based on the players and therefore offers a way to check easily where specific players are, so implementing this functionality would consist of producing a window (displayed on the HTML5 canvas) when you go on the game page, where the games are displayed with the name of the users in them, such that a second user can be added to the desired game.  

- Spectator mode and player queue

Only two players can connect to a single game for now, but it might be interesting to allow spectators to join an ongoing game. An additional option could be that spectators are kept in a queue, where the defeated played leaves the game and the first spectator confronts the winning player, for example.
The game object allows only two players to give input for the game state and to retrieve it, and adding a second list of client connections allowed to retrieve the game state would be simple to implement, as is the change from the queue to the list of main players.
