//import { AddScoreIfTop } from  "./firestore-test.js";
// Load scores from local storage
class LocalBoard{
  constructor(filename){
    this.level_name = filename.replace(".json", "");
    this.level_key = Initialize() + "-scores";
    this.scores = JSON.parse(localStorage.getItem(level_key)) || [];
    this.level_title = level_name + " Scoreboard";
  }

  RunBoard(a_new_score){
    document.querySelector("h1").textContent = this.level_title;
    // Add an event listener to the clear button
    document.getElementById("clear-button").addEventListener("click", clearBoard);
    // Refresh the scoreboard table initially
    refreshScoreboard();
    // Add a listener for the form submission
    document.getElementById("score-form").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the form from submitting
    
      // Get the name and score and date
      let name_input = document.getElementById("name-input");
      
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let yyyy = today.getFullYear();
      currentDate = String(mm+ '/' + dd + '/' + yyyy);
      // Create a new score object with the name and score
      let new_score = {
        name: name_input.value,
        score: a_new_score,
        date: currentDate
      };
      
        // Add the new score to the scores array
        this.scores.push(new_score);
      
        // Sort the scores by descending order of score
        this.scores.sort((a, b) => b.score - a.score);
      
        // If there are more than 10 scores, remove the lowest score
        if (this.scores.length > 10) {
          this.scores.pop();
        }
      
        // Save the scores to local storage
        localStorage.setItem(this.level_key, JSON.stringify(this.scores));
      
        //Check if score beats global leaderboard scores
        /*let user_ID = GetUserID(); get and send the userId to global leaderboard database*/
        AddScoreIfTop(this.level_name, new_score.name, new_score.score, user_ID)
        // Clear the name input field
        document.getElementById("score-form").remove();
      
        // Refresh the scoreboard table with the updated scores
        refreshScoreboard();
      });
    }
  
 
  //Clears all scores and players from the board
  clearBoard(){
    this.scores = [];
    localStorage.setItem(this.level_key, JSON.stringify(this.scores));
    refreshScoreboard();
  }
  
  // Function to refresh the scoreboard table
  refreshScoreboard() {
    document.querySelector("h1").textContent = this.level_title;
    document.getElementById("clear-button").addEventListener("click", clearBoard);
    let tbody = document.querySelector("#scoreboard tbody");
  
    // Remove all existing rows from the table
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  
    // Add rank, name, score, date into rows
    this.scores.forEach(function(score, index) {
      let tr = document.createElement("tr");
      let rank_td = document.createElement("td");
      let name_td = document.createElement("td");
      let score_td = document.createElement("td");
      let date_td= document.createElement("td");
  
      rank_td.textContent = index + 1;
      name_td.textContent = score.name;
      score_td.textContent = score.score;
      date_td.textContent = score.date;
  
      tr.appendChild(rank_td);
      tr.appendChild(name_td);
      tr.appendChild(score_td);
      tr.appendChild(date_td);
      tbody.appendChild(tr);
    });
  }
}





  
  
  

