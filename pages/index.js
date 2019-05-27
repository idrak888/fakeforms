import React, { Component } from 'react';
import Head from 'next/head';
import Note from '../components/Note';
import io from 'socket.io-client';

class Notes extends Component {
    state = {
        notes: [
            
        ],
        hello: ''
    }
    componentDidMount() {
        this.socket = io();
        for (let i=0;i<this.state.notes.length;i++) {
            this.dragElement(document.querySelectorAll('.Note')[i]);
        }
        this.socket.on('NoteAdded', (data) => {
            console.log('New note: ' + data.title);

            var notes = this.state.notes;
            notes.push(data.title);
            this.setState({notes});

            setTimeout(() => {
                document.querySelectorAll('.Note')[this.state.notes.length-1].classList.add('note' + this.state.notes.length);
                this.dragElement(document.querySelectorAll('.Note')[this.state.notes.length-1]);
            }, 500);
        });
        this.socket.on('TextEdited', data => {
            document.querySelectorAll('.Note textarea')[data.index].value = data.text;
        });
        this.socket.on('MoveElement', data => {
            console.log(data.elmnt);
            console.log('Top: ' + data.top);
            console.log('Bottom: ' + data.bottom);
        })
        this.socket.on('now', data => {
            this.setState({hello: data.message});
        })
        this.socket.on('testWorks', data => {
            var clas = '.' + data.cls;
            document.querySelector(clas).style.top = data.top;
            document.querySelector(clas).style.left = data.left;
        })
    }
    
    dragElement = (elmnt) => {
        var socket = this.socket;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.firstChild.onmousedown = dragMouseDown;
        elmnt.firstChild.touchstart = dragMouseDown;

        var emitObj = {top: '', left: '', cls: ''};

        var target = elmnt;
        var cls = target.classList[2];

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.touchend = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            document.touchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            emitObj = {top: (elmnt.offsetTop - pos2) + "px", left: (elmnt.offsetLeft - pos1) + "px", cls}
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            socket.emit('test', emitObj);
        }
    }
    addNew = (e) => {
        e.preventDefault();

        this.socket.emit('newNote', {
            title: document.querySelector('input').value
        });

        document.querySelector('input').value = '';

    }
    edited = (index) => {
        var text = document.querySelectorAll('.Note textarea')[index].value;
        this.socket.emit('TextEdit', {
            text,
            index
        });
    }
    render() {
        return (
            <div className="Notes">
                <Head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <title>Notes</title>
                    <meta name="viewport" content="width=device-width,user-scalable=no"/>
                    <link rel="stylesheet" type="text/css" media="screen" href="/static/style.css" />
                </Head>
                <form onSubmit={this.addNew} >
                    <h4>{this.state.hello}</h4>
                    <input placeholder="Title" type="text"/>
                </form>
                {this.state.notes.map((note, index) => {
                    return <Note key={index} edit={() => this.edited(index)} title={note}/>
                })}
            </div>
        )
    }
}

export default Notes;