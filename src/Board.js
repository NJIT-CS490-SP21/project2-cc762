import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection

function BoardComponent(props){
    const title = "Tic Tac Toe"
    const [board, setBoard] = useState(['-','-','-','-','-','-','-','-','-']);
    const inputRef = useRef(null); // Reference to <input> element
    
    function updateBoard(num, usr) {
        var b = [...board];
        b[num] = usr.xo;//theres a 0 here cause we're using the wacky use state syntax and getUsr returns an object in an array
        
        props.swapTurn(usr);
        
        setBoard(board => b);
    }
    
    useEffect(() => {
        socket.on('board', (data) => {
          console.log('Socked recieved board update');
          console.log(data);
          updateBoard(data.num, data.usr)
        });
    });
  
    function onClickButton(num, usr) {
        if (inputRef != null) {
            updateBoard(num, usr)
          socket.emit('board', { num: num, usr: usr});
        }
    }
    
    //key is set to get console to stop complaining
    return (
        <div class="board">
        {board.map((cell, index) => <Cell onClickButton={onClickButton} value={cell} num={index} key={index} getUsr={props.getUsr}/>)}
        </div>
    );
}

function Cell(props)
{
    return (
        <div onClick={() => props.onClickButton(props.num, props.getUsr())} class="box">{props.value}</div>
        );
}

export default BoardComponent;