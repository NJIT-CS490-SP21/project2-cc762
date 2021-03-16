import React from "react";

//maps all the users in players into an unordered list
function UserListComponent(props) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Users</th>
        </tr>
        {props.allUsrs.map((usr, index) => (
          <tr>
            <th key={index}>
              {usr.name}: {usr.xo}
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default UserListComponent;
