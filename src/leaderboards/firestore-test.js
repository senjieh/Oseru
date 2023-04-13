import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, updateDoc,
  deleteDoc, getDoc, getDocs, setDoc, 
  collection, doc, query, orderBy, 
  limit, where, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDU5XtGo5gNOfZKqA_5_nUUVoDM_cBoZWE",
  authDomain: "leaderboard-333.firebaseapp.com",
  projectId: "leaderboard-333",
  storageBucket: "leaderboard-333.appspot.com",
  messagingSenderId: "567434960342",
  appId: "1:567434960342:web:3ab15d265107af91c1d877",
  measurementId: "G-0NDFR4EWD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const songName =  "SilentNight";
const userName = "JoeMama";
const userID = Math.random().toString(36).substring(2);
const score = Math.floor(Math.random() * 1000) + 1;


//function for initializing the collection... was just done manually
async function InitializeCollection(){
  const collections = await db.listCollections();
  const collection_exists = collections.some((col)=> col.id === "scoreboards");
  if(!collection_exists){
    await db.collection("scoreboards").add({
      title: "fake-song"
    }).then(() => {
      console.log("Song added")
    })
  }
}

//function for adding songs... was just done manually
async function AddNewSong(songName){
  const boardsRef = collection(db, "songboards");
  const songRef = doc(boardsRef, songName);
  const songDoc = await getDoc(songRef);
  if(songDoc.exists){
    return;
  }else{
    await addDoc(boardsRef, {
        title: songName
    });
  }
}


// function to add a song document to the database
async function AddScoreIfTop(songName, userName, score, userID) {
  const songRef = doc(db, "songboards", songName);
  const songDoc = await getDoc(songRef);

  if (!songDoc.exists()) {
    console.log("Song does not exist");
    return;
  }

  const scoresRef = collection(songRef, "scores");
  const zeroRef = doc(scoresRef, "Score0");
  const zeroCheck = await getDoc(zeroRef);
  if(zeroCheck.exists()){
    await deleteDoc(zeroRef);
  }

  let userDocRef;
  let userDoc;

  const userScoresQuery = query(scoresRef, where("user_ID", "==", userID));
  const userScoresQuerySnapshot = await getDocs(userScoresQuery);

  if (userScoresQuerySnapshot.empty) {
    userDocRef = await addDoc(scoresRef, {
      user_name: userName,
      user_ID: userID,
      score: score,
      timestamp: serverTimestamp(),
    });
    userDoc = await getDoc(userDocRef);
  } else {
    userDocRef = doc(scoresRef, userScoresQuerySnapshot.docs[0].id);
    userDoc = await getDoc(userDocRef);
    if(userDoc.data().score > score){
      return;
    }
    await updateDoc(userDocRef, {
      score: score,
      timestamp: serverTimestamp(),
    });
  }
  const scoresQuery = query(scoresRef, orderBy("score"));
  const scoresQuerySnapshot = await getDocs(scoresQuery);
  const scoresCount = scoresQuerySnapshot.size;
  if (scoresCount > 10) {
    while(scoresCount > 10){
      const lowestScoreDoc = scoresQuerySnapshot.docs[0];
      const secondLowestScoreDoc = scoresQuerySnapshot.docs[1];
      const lowestTimestamp = lowestScoreDoc.data().timestamp;
      const secondLowestTimestamp = secondLowestScoreDoc.data().timestamp;
      if (lowestScoreDoc.data().score === secondLowestScoreDoc.data().score) {
        // remove the score with the later timestamp
        if (lowestTimestamp > secondLowestTimestamp) {
          await deleteDoc(lowestScoreDoc.ref);
        } else {
          await deleteDoc(secondLowestScoreDoc.ref);
        }
      } else {
        await deleteDoc(lowestScoreDoc.ref);
      }
      scoresCount--;
    }
  }
}
//addScoreIfTop(songName, userName, score);

// Function to render the leaderboard data
function renderLeaderboard(scores) {
  // Get the leaderboard table element
const leaderboardTable = document.getElementById("leaderboard-table");
  // Clear the current contents of the leaderboard table
  leaderboardTable.innerHTML = "";

  // Add the table header row
  const headerRow = leaderboardTable.insertRow();
  const rankHeader = headerRow.insertCell(0);
  rankHeader.innerHTML = "Rank";
  const nameHeader = headerRow.insertCell(1);
  nameHeader.innerHTML = "Name";
  const scoreHeader = headerRow.insertCell(2);
  scoreHeader.innerHTML = "Score";

  // Loop through the scores and add them to the table
  let rank = 1;
  scores.forEach((score) => {
    const row = leaderboardTable.insertRow();
    const rankCell = row.insertCell(0);
    rankCell.innerHTML = rank;
    const nameCell = row.insertCell(1);
    nameCell.innerHTML = score.user_name;
    const scoreCell = row.insertCell(2);
    scoreCell.innerHTML = score.score;
    rank++;
  });
}

// Function to get the leaderboard data and render it
async function getAndRenderLeaderboard() {
  // Get the top 10 scores in descending order
  const songRef = doc(db, "songboards", songName);
  const scoresRef = collection(songRef, "scores");
  const scoresQuery = query(scoresRef, orderBy("score", "desc"));
  const scoresSnapshot = await getDocs(scoresQuery);
  const scores = [];

  // Loop through the scores and add them to the array
  scoresSnapshot.forEach((doc) => {
    scores.push(doc.data());
  });

  // Render the leaderboard data
  renderLeaderboard(scores);
}
AddScoreIfTop(songName, userName, score, userID); 
getAndRenderLeaderboard(); 
  






