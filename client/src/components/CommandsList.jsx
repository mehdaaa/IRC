import React from 'react';

function CommandsList() {
    return (
        <div className="commands-list">
            <div>Commands list :</div>
            <ul>
                <li><b>/nick nickname:</b> change your nickname on the serve</li>
                <li>
                    <b>/list [string]:</b> list the available channels from the server. If string
                    is specified, only displays those whose name contains the string.
                </li>
                <li><b>/create channel:</b> create a channel with the specified name</li>
                <li><b>/delete channel:</b> delete the channel with the specified name</li>
                <li><b>/join channel:</b> join the specified channel</li>
                <li><b>/quit channel:</b> quit the specified channel</li>
                <li><b>/room name:</b> change the name of the channel</li>
                <li><b>/users:</b> list the users currently in the channel</li>
                <li>
                    <b>/msg nickname message:</b> send a private message to the specified
                    nickname.
                </li>
                <li></li>
            </ul>
        </div>
    );
}

export default CommandsList;