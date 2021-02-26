import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection

function BoardComponent(){
    const title = "Tic Tac Toe"
    const [board, setBoard] = useState(['-','-','-','-','-','-','-','-','-']);
    const [turn, setTurn] = useState(['X'])
    const [messages, setMessages] = useState([]); // State variable, list of messages
    const inputRef = useRef(null); // Reference to <input> element
    
    function updateBoard(num, turn) {
        var b = [...board];
        b[num] = turn;
        
        if(turn == 'X')
        {
            setTurn(turn => 'O');
        }
        else{
            setTurn(turn => 'X');
        }
        
        setBoard(board => b);
    }
    
    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('board', (data) => {
          console.log('Updating Board In Board');
          console.log(data);
          updateBoard(data.num)
        });
    }, []);
  
    function onClickButton(num) {
        if (inputRef != null) {
            updateBoard(num)
          socket.emit('board', { num: num });
        }
    }
    
    return (
        <div class="board">
        {board.map((cell, index) => <Cell onClickButton={onClickButton} value={cell} num={index}/>)}
        </div>
    );
}

function Cell(props)
{
    return (
        <div onClick={() => props.onClickButton(props.num)} class="box">{props.value}</div>
        );
}

export default BoardComponent;