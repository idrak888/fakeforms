const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const next = require('next');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const dev = process.env.NODE_ENV || 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3100;

io.on('connect', socket => {
    socket.emit('now', {
        message:'Notes loaded'
    });
    socket.on('newNote', data => {
        io.emit('NoteAdded', {
            title: data.title
        });
    });
    socket.on('TextEdit', data => {
        io.emit('TextEdited', {
            text:data.text,
            index:data.index
        });
    });
    socket.on('test', (data) => {
        io.emit('testWorks', {
            top: data.top,
            left: data.left,
            cls: data.cls
        });
    });
});

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    })
    server.listen(port, (err) => {
        if (err) throw err;
        console.log('Server started on port ' + port);
    })
});