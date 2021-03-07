import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function LeaderboardComponent(){
    const [leader, setLeader] = useState([]);
    const [show, setShow] = useState(0)
    
    useEffect(() => {
      //Listener for app.py returning the userlist
      socket.on('leaderboard', (data) => {
        console.log('Socked recieved leaderboard');
        setLeader(data)
      });
    }, []);
    
    function swapShow(){
        console.log("Swapping showing of leaderboard");
        setShow(prev => {
            return !prev;
        });
        socket.emit('leaderboard', {id:socket.id});
    }
    
    return (
        <div onClick={swapShow}>Leaderboard
        <table><tbody><tr><th></th></tr>{leader.map((player, index) => <tr><th key={index}>{player.username}: {player.points}</th></tr>)}</tbody></table>
        </div>
        )
}
export default LeaderboardComponent;