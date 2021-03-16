import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function LeaderboardComponent(props) {
  const [leader, setLeader] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('leaderboard', (data) => {
      console.log('Socked recieved leaderboard');
      setLeader(data);
    });
  }, []);

  function swapShow() {
    console.log('Swapping showing of leaderboard');
    setShow((prev) => !prev);
    socket.emit('leaderboard', { id: socket.id });
  }

  if (show) {
    console.log(props.usr.name);
    return (
      <div className="outlined" onClick={swapShow}>
        Leaderboard
        <div>
          <table>
            <tbody>
              <tr>
                <th>Player</th>
                <th>Points</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
              {leader.map((player, index) => (
                <tr
                  className={
                    player.username === props.usr[0].name ? 'bold' : null
                  }
                >
                  <th key={index}>{player.username}</th>
                  <th>{player.points}</th>
                  <th>{player.wins}</th>
                  <th>{player.losses}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="outlined" onClick={swapShow}>
      Leaderboard
    </div>
  );
}
export default LeaderboardComponent;
