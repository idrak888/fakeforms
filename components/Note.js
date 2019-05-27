import React from 'react';

const Note = props => {
    return (
        <div className="Note mydiv">
            <div className="mydivheader">
                <strong>{props.title}</strong>
            </div>
            <textarea onChange={props.edit} placeholder="Body"></textarea>
        </div>
    );
}

export default Note;    