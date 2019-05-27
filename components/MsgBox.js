import React from 'react';

const MsgBox = props => {
    return (
        <div className="MsgBox">
            <h3>Your account has been created!</h3>
            <p>A verification email has been sent to {props.email}. <br/>
            Please follow the link to have your account verified.</p>
            <br/>
            <a href="/notes">OK</a>
        </div>
    );
}

export default MsgBox;