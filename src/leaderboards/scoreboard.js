// Load scores from local storage
let scores = JSON.parse(localStorage.getItem("scores")) || [];

// Add a listener for the form submission
document.getElementById("score-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the name and score and date
  let nameInput = document.getElementById("name-input");
  let score = Math.floor(Math.random() * 901) + 100; // Generate a random score between 100 and 1000
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  currentDate = String(mm+ '/' + dd + '/' + yyyy);
  // Create a new score object with the name and score
  let newScore = {
    name: nameInput.value,
    score: score,
    date: currentDate
  };

  // Add the new score to the scores array
  scores.push(newScore);

  // Sort the scores by descending order of score
  scores.sort((a, b) => b.score - a.score);

  // If there are more than 10 scores, remove the lowest score
  if (scores.length > 10) {
    scores.pop();
  }

  // Save the scores to local storage
  localStorage.setItem("scores", JSON.stringify(scores));

  // Clear the name input field
  document.getElementById("score-form").remove();

  // Refresh the scoreboard table
  refreshScoreboard();
});
function clearBoard(){
    scores = [];
    localStorage.setItem("scores", JSON.stringify(scores));
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
    let rankTd = document.createElement("td");
    let nameTd = document.createElement("td");
    let scoreTd = document.createElement("td");
    let dateTd= document.createElement("td");

    rankTd.textContent = index + 1;
    nameTd.textContent = score.name;
    scoreTd.textContent = score.score;
    dateTd.textContent = score.date;

    tr.appendChild(rankTd);
    tr.appendChild(nameTd);
    tr.appendChild(scoreTd);
    tr.appendChild(dateTd);
    tbody.appendChild(tr);
  });
}


// Initial refresh of the scoreboard table
refreshScoreboard();

