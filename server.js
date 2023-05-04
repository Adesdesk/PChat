require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
const access = process.env.DATABASE_ACCESS;
const dburl = "mongodb+srv://adesdeskUser01:" + access + "@adesdeskdatabase01.7znhfhj.mongodb.net/?retryWrites=true&w=majority";
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Message = mongoose.model('Message',{ name : String, message : String});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});


app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
      io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', () =>{
  console.log('a user is connected')
 })

// Connect to the database
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });

// Listen for the connection event
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
});

// Listen for the error event
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// Listen for the disconnection event
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

var server = app.listen(5000, () => {
    console.log('server is running on port', server.address().port);
   });
