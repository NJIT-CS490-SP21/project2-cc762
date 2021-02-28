import React from 'react';

//maps all the users in players into an unordered list
function UserListComponent(props){
    return(
    <ul>{props.allUsrs.map((usr, index) => <li key={index}>{usr.name}: {usr.xo}</li>)}</ul>
    );
}
export default UserListComponent;