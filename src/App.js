import './App.css';
import BoardComponent from './Board.js'
import LoginComponent from './Login.js'
import UserListComponent from './Users.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const state = useState([]);
  const [allUsrs, setAllUsrs] = useState([]);
  const [usr, setUsr] = useState([{name: "", xo: ""}])
  
  //Listener for login
  useEffect(() => {
      socket.on('updateUsers', (data) => {
        console.log('Socked recieved other user connect');
        getAllUsr();
      });
  });
  
  //Listener for app.py returning the userlist
  useEffect(() => {
      socket.on('requestUserList', (data) => {
        console.log('Socked recieved list of users');
        setAllUsrs(allUsrs => data)
      });
  });
  
  function resetUsers(){
    setAllUsrs(allUsrs => [])
    setUsr(usr => [{name: "", xo: ""}])
  }
  
  function getAllUsr(){
    socket.emit('requestUserList');
  }
  
  function getUsr(){
    console.log("Getting usr");
    return usr[0];
  }
  
  function swapTurn(){
    console.log("not implemented");
  }
  
  function addUsr(data){
    setUsr(usr => [{name: data["name"], xo: data["xo"]}]);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Tic Tac Toe
        </p>
        <UserListComponent allUsrs={allUsrs}/>
        <LoginComponent addUsr={addUsr}/>
        <BoardComponent resetUsers={resetUsers} usr={usr} getUsr={getUsr} swapTurn={swapTurn}/>
      </header>
    </div>
  );
}

export default App;
