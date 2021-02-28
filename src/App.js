import logo from './logo.svg';
import './App.css';
import BoardComponent from './Board.js'
import LoginComponent from './Login.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const state = useState([]);
  const [usr, setUsr] = useState([{name: "", xo: ""}])
  const [players, setPlayers] = useState([]);
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Cell click recieved');
      console.log(data);
    });
  }, []);
  
  function getUsr(){
    console.log("Getting usr");
    console.log(usr);
    return usr[0];
  }
  
  function swapTurn(){
    console.log("not implemented");
  }
  
  function addUsr(usr, set=false){
    console.log("adding usr: " + usr)
    var p = [...players, {name: usr, xo: "X"}];
    setPlayers(players => p);
    if(set)
    {
      setUsr(usr => [{name: usr, xo: "X"}]);
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Tic Tac Toe
        </p>
        <ul>{players.map((usr, index) => <li key={index}>{usr.name}: {usr.xo}</li>)}</ul>
        <LoginComponent addUsr={addUsr}/>
        <BoardComponent usr={usr} getUsr={getUsr} swapTurn={swapTurn}/>
      </header>
    </div>
  );
}

export default App;
