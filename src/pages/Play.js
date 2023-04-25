import React from 'react';
import { useLocation } from 'react-router-dom';
import Game from '../components/Game';

export default function Play() {
    const location = useLocation();
    const mapDocID = location.state?.mapID;

    console.log("mapID", mapDocID);
    return (
        <Game mapID={mapDocID}></Game>
    );
}