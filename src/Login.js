import React, { useEffect } from 'react';
import './Login.css';

import io from 'socket.io-client';

const socket = io();

function LoginComponent(props) {
  const loginRef = React.createRef(); // Creates a ref for use later, see where we attach it to input in the return

  function login() {
    const usr = loginRef.current.value; // Since the ref was assigned to text input we can just ask for the value here
    socket.emit('login', { usr, id: socket.id });
  }

  // Listener for app.py returning the userlist
  useEffect(() => {
    socket.on('addUserCallback', (data) => {
      console.log(socket.id);
      console.log('Socket Recieved Confirmation of user adding from server');
      props.addUsr(data);
    });
  }, [props]);

  // Note here that the text input has a ref assigned
  return (
    <div>
      <input type="text" ref={loginRef} />
      <button onClick={login}>Log In</button>
    </div>
  );
}

export default LoginComponent;
