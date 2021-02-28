import logo from './logo.svg';
import './App.css';
import BoardComponent from './Board.js'
import LoginComponent from './Login.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const state = useState([]);
  const usr = useState({name: "", xo: ""})
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
    return usr;
  }
  
  function swapTurn(){
    console.log("not implemented");
  }
  
  function addUsr(data){
    console.log("not implemented");
    console.log(data);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Charles Crider
          <LoginComponent addUsr={addUsr}/>
        </p><BoardComponent usr={usr} getUsr={getUsr} swapTurn={swapTurn}/>
      </header>
    </div>
  );
}

export default App;
