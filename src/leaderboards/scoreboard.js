// Load scores from local storage
let level_name = "SilentNight";
let level_key = level_name + "-scores";
let scores = JSON.parse(localStorage.getItem(level_key)) || [];
let 
let level_title = level_name + " Scoreboard";
document.querySelector("h1").textContent = level_title;

// Refresh the scoreboard table initially
refreshScoreboard();

// Add an event listener to the clear button
document.getElementById("clear-button").addEventListener("click", clearBoard);

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
  FinalScore.CalculateFinalScore().then((score) => {
    let new_score = {
      name: name_input.value,
      score: score,
      date: currentDate
    };
  
    // Add the new score to the scores array
    scores.push(new_score);
  
    // Sort the scores by descending order of score
    scores.sort((a, b) => b.score - a.score);
  
    // If there are more than 10 scores, remove the lowest score
    if (scores.length > 10) {
      scores.pop();
    }
  
    // Save the scores to local storage
    localStorage.setItem(level_key, JSON.stringify(scores));
  
    // Clear the name input field
    document.getElementById("score-form").remove();
  
    // Refresh the scoreboard table with the updated scores
    refreshScoreboard();
  });
});
//Clears all scores and players from the board
function clearBoard(){
  scores = [];
  localStorage.setItem(level_key, JSON.stringify(scores));
  refreshScoreboard();
}

// Function to refresh the scoreboard table
function refreshScoreboard() {
  let tbody = document.querySelector("#scoreboard tbody");

  // Remove all existing rows from the table
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Add rank, name, score, date into rows
  scores.forEach(function(score, index) {
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

  
  
  

