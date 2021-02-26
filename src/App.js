import logo from './logo.svg';
import './App.css';
import BoardComponent from './Board.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const state = useState([]);
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Chat event received!');
      console.log(data);
    });
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Charles Crider
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        
        
          Learn React
        </a><BoardComponent />
      </header>
    </div>
  );
}

export default App;
