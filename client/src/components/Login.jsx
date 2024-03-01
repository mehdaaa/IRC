import React from 'react';
import parle from "../styles/images/parle.png";

function Login({ chooseName }) {
    return (
        <div className="loginPage">
            <div className="headerLogin">
                <img src={parle} alt="Parle_logo"/>
            </div>
            <div className="formLogin">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    chooseName(e.target[0].value);
                }}>

                    <input type="text" placeholder='Type your username...' />
                    <button type='submit'>Join</button>

                </form>
            </div>
        </div>
    );
}

export default Login;