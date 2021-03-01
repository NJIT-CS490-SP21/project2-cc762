import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection

function BoardComponent(props){
    const title = "Tic Tac Toe"
    const [board, setBoard] = useState(['-','-','-','-','-','-','-','-','-']);
    const [turn, setTurn] = useState(0);
    const [win, setWin] = useState("Playing")
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
          updateBoard(data.num, data.usr);
          console.log(turn);
          setTurn(turn => data.turn);
        });
        
        socket.on('reset', (data) => {
          console.log('Resetting Game');
          setTurn(turn => 0);
          setBoard(board => ['-','-','-','-','-','-','-','-','-']);
          props.resetUsers();
        });
    });
    
    function onClickButton(num, usr) {
        //Check if the user is allowed to play
        //Check if the space is empty
        //Check if the its the user's turn
        if(
            (usr["xo"] === "X" || usr["xo"] === "O") &&
            (board[num] === "-") &&
            ((usr["xo"] === "X" && turn % 2 == 0) || (usr["xo"] === "O" && turn % 2 == 1))
            ){
                socket.emit('board', { num: num, usr: usr});
            }
    }
    
    //key is set to get console to stop complaining
    return (
        <div>
        <ResetComponent/>
        <p>{win}</p>
        <p>Turn: {turn}</p>
        <div class="board">
        {board.map((cell, index) => <Cell onClickFunc={onClickButton} value={cell} num={index} key={index} getUsr={props.getUsr}/>)}
        </div></div>
    );
}
    
function Cell(props){
    return (
    <div onClick={() => props.onClickFunc(props.num, props.getUsr())} class="box">{props.value}</div>
    );
}

function ResetComponent(){
    return <div onClick={() =>{socket.emit("reset")}}>Reset</div>
}
export default BoardComponent;