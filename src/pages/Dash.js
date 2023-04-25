import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, limit, getDocs, orderBy, startAfter } from "firebase/firestore";
import { db } from '../firebase'; // Import your Firestore database instance

export default function Dash() {
  const [songs, setSongs] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (lastVisibleDoc = null) => {
    const songsRef = collection(db, "songs");
    let songQuery;

    if (lastVisibleDoc) {
      // Query the next 25 songs after the last visible document
      songQuery = query(songsRef, startAfter(lastVisibleDoc), limit(25));
    } else {
      // Query the first page of songs
      songQuery = query(songsRef, limit(25));
    }

    const documentSnapshots = await getDocs(songQuery);

    // Get the last visible document
    const newLastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    console.log("last", newLastVisible);
    setLastVisible(newLastVisible);

    // Map documents to their data
    const newSongs = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSongs(newSongs);
    console.log("songs", newSongs);
  };

  const handleNextButtonClick = () => {
    fetchData(lastVisible);
  };

  const handlePlayButtonClick = (mapID) => {
    navigate('/play', { state: { mapID } });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.song_author}</td>
              <td>{song.song_name}</td>
              <td>{song.song_length}</td>
              <td>
                <button onClick={() => handlePlayButtonClick(song.id)}>Play</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleNextButtonClick}>Next</button>
    </div>
  );
}