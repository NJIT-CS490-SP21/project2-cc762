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
      
      //Listener for app.py returning the userlist
      socket.on('requestUserList', (data) => {
        console.log('Socked recieved list of users');
        setAllUsrs(allUsrs => data)
      });
      getAllUsr()
  }, []);
  
  function resetUsers(){
    console.log("Resetting users")
    setAllUsrs([])
    setUsr([{name: "", xo: ""}])
  }
  
  function getAllUsr(){
    socket.emit('requestUserList');
  }
  
  function getUsr(){
    console.log("Getting usr");
    return usr[0];
  }
  
  function addUsr(data){
    setUsr([{name: data["name"], xo: data["xo"]}]);
  }
  
  function isLoggedIn(){
    console.log("Logged in = " + !(usr[0]["name"] === ""))
    return (!(usr[0]["name"] === ""));
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
        <div class="pageGrid">
          <div><BoardComponent show={isLoggedIn} resetUsers={resetUsers} usr={usr} getUsr={getUsr}/></div>
          <div class="stacked">
            {isLoggedIn() && <div>You are: {usr[0]["name"]}, and are {usr[0]["xo"]}</div>}
            <LoginComponent addUsr={addUsr}/>
            <UserListComponent allUsrs={allUsrs}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
