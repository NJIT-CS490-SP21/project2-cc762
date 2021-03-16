import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BoardComponent from './Board.js';
import LoginComponent from './Login.js';
import UserListComponent from './Users.js';
import LeaderboardComponent from './Leaderboard.js';

const socket = io(); // Connects to socket connection

function App() {
  const [allUsrs, setAllUsrs] = useState([]);
  const [usr, setUsr] = useState([{ name: '', xo: '' }]);

  function getAllUsr() {
    socket.emit('requestUserList', { id: socket.id });
  }

  // Listener for login
  useEffect(() => {
    socket.on('updateUsers', (data) => {
      getAllUsr();
    });

    // Listener for app.py returning the userlist
    socket.on('requestUserList', (data) => {
      setAllUsrs((allUsrs) => data);
    });
    getAllUsr();
  }, []);

  function resetUsers() {
    setAllUsrs([]);
    setUsr([{ name: '', xo: '' }]);
  }

  function getUsr() {
    return usr[0];
  }

  function addUsr(data) {
    setUsr([{ name: data.name, xo: data.xo }]);
  }

  function isLoggedIn() {
    return !(usr[0].name === '');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        <div className="pageGrid">
          <div>
            <BoardComponent
              show={isLoggedIn}
              resetUsers={resetUsers}
              usr={usr}
              getUsr={getUsr}
            />
          </div>
          <div className="stacked">
            {isLoggedIn() && (
              <div>
                You are:
                {' '}
                {usr[0].name}
                , and are
                {' '}
                {usr[0].xo}
              </div>
            )}
            <LoginComponent addUsr={addUsr} />
            <UserListComponent allUsrs={allUsrs} />
            <LeaderboardComponent usr={usr} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
