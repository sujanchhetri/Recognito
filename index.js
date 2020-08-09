'use strict';

var apiai = require('apiai');
var APIAI_TOKEN =apiai("5afc4bdf601046b39972ff3866cca392");
const APIAI_SESSION_ID = "chatbot-clvxfh";

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server is running at port ${PORT}`)
)

app.use(express.static(__dirname + '/views')); 
app.use(express.static(__dirname + '/files')); 



const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});



// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = APIAI_TOKEN.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});


