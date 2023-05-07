require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const access = process.env.DATABASE_ACCESS;
const dburl = "mongodb+srv://adesdeskUser01:" + access + "@adesdeskdatabase01.7znhfhj.mongodb.net/?retryWrites=true&w=majority";
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const http = require('http').Server(app);
const io = require('socket.io')(http);

const messageSchema = new mongoose.Schema({ 
  name: String, 
  message: String 
});

const Message = mongoose.model('Message', messageSchema);

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.get('/messages', (req, res) => {
  Message.find({})
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  message.save()
    .then(() => {
      io.emit('message', req.body);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

io.on('connection', () => {
  console.log('a user is connected');
});

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

const server = app.listen(5000, () => {
  console.log('server is running on port', server.address().port);
});
