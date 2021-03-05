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
        console.log(""+ board);
        console.log("Updating board cell: " + num + usr["xo"])
        
        setBoard(prevBoard => {
            const b = [ ...prevBoard ];
            b[num] = usr["xo"];
            return b;
        });
    }
    
    useEffect(() => {
        socket.on('board', (data) => {
          console.log('Socked recieved board update: ' + data + " " + turn);
          updateBoard(data["num"], data["usr"]);
          setTurn(data.turn);
        });
        
        socket.on('win', (data) => {
           setWin("Winner: " + data);
        });
        
        socket.on('reset', (data) => {
          console.log('Resetting Game');
          setBoard(['-','-','-','-','-','-','-','-','-']);
          setTurn(0);
          props.resetUsers();
          setWin("Playing");
          console.log("Resetting Board to: " + board);
        });
    }, []);
    
    function onClickButton(num, usr) {
        //Check if the user is allowed to play
        //Check if the space is empty
        //Check if the its the user's turn
        if(
            (usr["xo"] === "X" || usr["xo"] === "O") &&
            (board[num] === "-") &&
            ((usr["xo"] === "X" && turn % 2 == 0) || (usr["xo"] === "O" && turn % 2 == 1) &&
            win ==="Playing")
            ){
                console.log("Changing board cell: " + num);
                socket.emit('board', { num: num, usr: usr});
            }
    }
    
    //key is set to get console to stop complaining
    //if(props.show())
    if(true)
    {
        return (
            <div>
            <ResetComponent/>
            {win !== "Playing" && <p>{win}</p>}
            <p>Turn: {turn}</p>
            <div class="board">
            {board.map((cell, index) => <Cell onClickFunc={onClickButton} value={cell} num={index} key={index} getUsr={props.getUsr}/>)}
            </div></div>
        );
    }
    else{
        return <div></div>;
    }
}
    
function Cell(props){
    return (
    <div onClick={() => props.onClickFunc(props.num, props.getUsr())} class="box">{props.value}</div>
    );
}

function ResetComponent(){
    return (
        <div onClick={() =>{socket.emit("reset")}}>Reset</div>
    );
}
export default BoardComponent;