import React from 'react';

function ChatBody({messageList}) {
    return (
        <div className="chat-body">
            {messageList.length ? (messageList.map((messageContent) => (
                <div className='message'>
                    <div className='message-infos'>
                        <div><b>{messageContent.author}</b>
                            <span className="tm">
                                at {new Date(messageContent.dateTime).getHours()}
                                : {new Date(messageContent.dateTime).getMinutes()}
                            </span>
                        </div>
                    </div>
                    <div className='message-content'>
                        <p>{messageContent.message}</p>
                    </div>
                </div>

            ))):
                <div className="noRoomContainer">
                    <div>Send the first message</div>
                </div>
            }
        </div>
    );
}

export default ChatBody;