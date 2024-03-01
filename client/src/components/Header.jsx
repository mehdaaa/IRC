import React from 'react';
import parle from "../styles/images/parle.png"

function Header({username, activeTab}) {
    return (
        <div className="header">
            <figure className="image">
                <img src={parle} alt="Parle_logo"/>
            </figure>
            <div className="connection">
                <b>Connect as </b>
                <span className="username">{username}</span>
            </div>
        </div>
    );
}

export default Header;