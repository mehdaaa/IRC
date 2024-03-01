import React from 'react';

function ChannelsList({channelsList}) {
    console.log(channelsList)
    return (
        <div className="channels-list">
            <div>Channels List</div>
            <ul>
                {channelsList.length ? (
                    channelsList.map((elem) => <li key={elem}>{elem}</li>)
                ) : (
                    <li>Pas de salon</li>
                )}
            </ul>
        </div>
    );
}

export default ChannelsList;