
// This is for me to use
import { db, auth } from "/Spring\ 2023/CS\ 320/Oseru/src/leaderboards/firebase-config.js";

// How it was before
// import { db, auth } from "/src/firebase-config.js";
import { updateDoc,
  deleteDoc, getDoc, getDocs, 
  collection, doc, query, orderBy, 
  where, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

/*some temp test variables
const songName =  "SilentNight";
var userName = "Tom";
var userID = "Tom#5055";
const score = Math.floor(Math.random() * 1000) + 1;*/
//=======================================================
//function for signing up with email and password
function MakeNewUser(){
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

//function for signing in with email and password
function SignInUser(auth, email, password){
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
//function for getting infor about the currently signed in user
function SignedInInfo(auth, user){
  onAuthStateChanged(auth, (user) => {
    if(user){
      //user is signed in
      const uid = user.uid;
    } else{
      //user signed out
    }
  })
}
//function for signing current user out
function SignUserOut(auth){
  signOut(auth);
}
//function for generating a unique user so two users cna have the same username
async function GenerateUniqueID(userName, scoresRef){
  let unique_code = Math.floor(Math.random() * 99900) + 100; //random code between 100 and 99999 
  let unique_ID = `${userName}#${unique_code}`;
  const userScoresQuery = query(scoresRef, where("user_ID", "==", unique_ID));
  const userScoresQuerySnapshot = await getDocs(userScoresQuery);
  if(!userScoresQuerySnapshot.empty){
    return (GenerateUniqueID(userName, scoreRef));
  }
  return(unique_ID);
}
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

//function to load a song file from database on click
async function LoadSongs(song_file_name){
  try{
    /*const song_db = collection(db, "songfiles");
    const song_ref = doc(song_db, song_file_name);
    const song_data = (await song_ref.get()).data();*/
    
    let song_data =[
      {
        title: "Silent Night",
        artist: "Franz Something",
        length: "3:12",
        album: "Placeholder"
      }
    ]
    // Find the table element by ID
    const table = document.getElementById('song-table');

    // Create a new row for the song data
    const row = table.insertRow();

    // Insert the song title
    const title_cell = row.insertCell();
    title_cell.innerText = song_data.title;
    title_cell.style = "font-weight:bold;";

    // Insert the artist name
    const artist_cell = row.insertCell();
    artist_cell.innerText = song_data.artist;
    artist_cell.style = "font-weight:bold;";

    // Insert the length of song
    const length_cell = row.insertCell();
    length_cell.innerText = song_data.length;
    length_cell.style = "text-align:center;";

    // Insert the length of song 
    const album_cell = row.insertCell();
    album_cell.innerText = song_data.album;

    // Insert the play and upload button
    const play_cell = row.insertCell();
    const play_button = document.createElement('button');
    const upload_cell = row.insertCell();
    const upload_button = document.createElement('button');
    play_button.classList.add('play-button');
    play_button.dataset.src = song_data.file_url;
    play_button.innerText = 'Play';
    play_button.style = "padding:0.5rem 1rem 0.5rem 1rem;";
    play_button.style.fontSize = "1.5rem";
    play_cell.appendChild(play_button);
    upload_button.classList.add('upload-button');
    upload_button.dataset.src = song_data.file_url;
    upload_button.innerText = 'Upload';
    upload_button.style = "padding:0.5rem 1rem 0.5rem 1rem;";
    upload_button.style.fontSize = "1.5rem";
    upload_cell.appendChild(upload_button);

  }catch(error){
    console.error('Error loading song file:', error);
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
      user_ID: await GenerateUniqueID(userName, scoresRef),
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
  var scoresCount = scoresQuerySnapshot.size;
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

  //Get the leaderboard title element
  document.querySelector("h1").textContent = songName + " Leaderboard";
  // Clear the current contents of the leaderboard table
  leaderboardTable.innerHTML = "";

  // Add the table header row
  const headerRow = leaderboardTable.insertRow();
  headerRow.bgColor="#dc2414";
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
    nameCell.innerHTML = score.user_ID;
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


//test runs
LoadSongs();
/*AddScoreIfTop(songName, userName, score, userID); 
getAndRenderLeaderboard();*/
  






