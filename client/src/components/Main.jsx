import React, { useEffect, useState } from 'react';
import alone from "../styles/images/alone.svg";
import ChatBody from "./ChatBody";
import CommandsList from "./CommandsList";
import ChannelsList from "./ChannelsList";
import UsersList from "./UsersList";
// import WelcomePage from "./WelcomePage";

function Main({ activeRoom, setMessage, messageList, handleMessage, activeTab, channelsList, usersList }) {

    function resetInput(){
        let button=  document.getElementById('buttonChat');
        button.value = "";
        handleMessage()
    }
    return (
        <div className="main">
            <div className="chat-header">
                <figure className="image">
                    <img src={alone} alt="Alone_logo"/>
                </figure>
                <h3>{activeRoom}</h3>
                {/*<p>{activeTab}</p>*/}
            </div>

            {/*{activeTab === "WelcomePage" ? <WelcomePage /> : null}*/}
            {activeTab === "messages" ? <ChatBody messageList={messageList}/> : null}
            {activeTab === "commands" ? <CommandsList /> : null}
            {activeTab === "channels" ? <ChannelsList channelsList={channelsList} /> : null}
            {activeTab === "users" ? <UsersList usersList={usersList} activeRoom={activeRoom}/> : null}

            <div className="chat-footer">
                <input id="buttonChat"
                    // maxLength="100"
                    type='text'
                    placeholder='Type here...'
                    onChange={(event) => {
                        setMessage(event.target.value)
                    }}
                    onKeyDown={(event) => {
                        event.key === "Enter" && resetInput();
                    }}

                />
                <button  onClick={resetInput}>⇧</button>
            </div>
        </div>
    );
}

export default Main; 