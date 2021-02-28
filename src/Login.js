import React from 'react';
import './Login.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function LoginComponent(props){
    const inputRef = useRef(null); // Reference to <input> element
    const loginRef = React.createRef();//Creates a ref for use later, see where we attach it to input in the return
    
    function login(){
        if (inputRef != null) {//
            var usr = loginRef.current.value;//Since the ref was assigned to text input we can just ask for the value here
            props.addUsr(usr)//call the addUsr function in App.js
            socket.emit('login', { usr: usr });
        }
    }
    
    //Note here that the text input has a ref assigned
    return (
        <div>
            <input type="text" ref={loginRef}/>
            <button onClick={login}>Log In</button>
        </div>
        );
}

export default LoginComponent;