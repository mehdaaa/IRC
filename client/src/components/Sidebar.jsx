import React from 'react';
import groups from "../styles/images/groups.svg"

function Sidebar({joinedRooms, askMessagesOfRoom, activeRoom}) {

    return (
        <div className="sidebar">
            <div className="titleSideBar">
                <figure className="image">
                    <img src={groups} alt="Groups_logo"/>
                </figure>
                <p className="channels">
                    CHANNELS
                </p>
            </div>
            <ul>
                {joinedRooms.length ? (joinedRooms.map((room) => (
                    <li key={room} className={room === activeRoom && 'activeRoom' }>
                        <button onClick={() => {
                            askMessagesOfRoom(room)
                        }}>
                            {room}
                        </button>
                    </li>
                ))) : (
                    <p>No room joined</p>
                )}
            </ul>
        </div>
    );
}

export default Sidebar;