import React from 'react';

function UsersList({usersList, activeRoom}) {
    return (
        <div className="users-list">
            <div>Users in the room : {activeRoom}</div>
            <ul>
                {usersList.length ? (
                    usersList.map((elem) => <li key={elem}>{elem}</li>)
                ) : (
                    <li>No one</li>
                )}
            </ul>
        </div>
    );
}

export default UsersList;