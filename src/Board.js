import React, { useState, useEffect } from 'react';
import './Board.css';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function BoardComponent(props) {
  const [board, setBoard] = useState([
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);
  const [turn, setTurn] = useState(0);
  const [win, setWin] = useState('Playing');



  useEffect(() => {
    socket.on('board', (data) => {
      console.log(`Socked recieved board update: ${data} ${turn}`);
      setTurn(data.turn);
      
      setBoard((prevBoard) => {
      const b = [...prevBoard];
      b[data.num] = data.usr.xo;
      return b;
    });
      
    });

    socket.on('win', (data) => {
      setWin(`Winner: ${data}`);
    });

    socket.on('reset', (data) => {
      console.log('Resetting Game');
      setBoard(['-', '-', '-', '-', '-', '-', '-', '-', '-']);
      setTurn(0);
      props.resetUsers();
      setWin('Playing');
      console.log(`Resetting Board to: ${board}`);
    });
  }, [board, props, turn]);

  function onClickButton(num, usr) {
    // Check if the user is allowed to play
    // Check if the space is empty
    // Check if the its the user's turn
    if (
      (usr.xo === 'X' || usr.xo === 'O')
      && board[num] === '-'
      && ((usr.xo === 'X' && turn % 2 === 0)
        || (usr.xo === 'O' && turn % 2 === 1 && win === 'Playing'))
    ) {
      console.log(`Changing board cell: ${num}`);
      socket.emit('board', { num, usr });
    }
  }

  // key is set to get console to stop complaining
  // if(props.show())
  if (props.show()) {
    return (
      <div>
        <ResetComponent />
        {win !== 'Playing' && <p>{win}</p>}
        <p>
          Turn:
          {turn}
        </p>
        <div className="board">
          {board.map((cell, index) => (
            <Cell
              onClickFunc={onClickButton}
              value={cell}
              num={index}
              key={index}
              getUsr={props.getUsr}
            />
          ))}
        </div>
      </div>
    );
  }
  return <div />;
}

function Cell(props) {
  return (
    <div
      onClick={() => props.onClickFunc(props.num, props.getUsr())}
      className="box"
    >
      {props.value}
    </div>
  );
}

function ResetComponent() {
  return (
    <div
      onClick={() => {
        socket.emit('reset');
      }}
    >
      Reset
    </div>
  );
}
export default BoardComponent;
