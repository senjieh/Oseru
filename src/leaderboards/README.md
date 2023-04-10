Small scoreboard opens in browser
Score is just a randomly generated number at the moment
Name is entered manually everytime the scoreboard is opened
Only the top 10 scores are kept

board.html - html for opening browser window for local scoreboard
boardstyle.css - css styling of browser window
scoreboard.js - logic for adding new player scores
score-system.js - logic for calculating the scores of each note
final-score-tally.js test to generate scores for every note, add all scores to a final score, then pass the score to the html leaderboard
note-score.test.js - test suites for the score system

integration check list:
for local leaderboard and scoresystem:
- get the name of the json file to be used for reading in note depending on which song is picked
- get the song name for title of each leaderboard
- get the player's played frequencies for each note
- get the player's played duration for each note
- make flag for player finishing a level for the submit score button to appear
- have the scoreboard displayed after the song is finished
- (maybe have a spot to view the local leaderboard for each song without playing the song?)

for global leaderboard:
- get players score and username only if it is in the top 10 scores recorded for that song
- get the correct song based on which json was selected
- make the displayed board better
- link the displayed board to the button that loads each songs global board
- (maybe optimize the database for less reads?)
