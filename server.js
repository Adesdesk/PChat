var express = require('express');

/*const mongoose = require('mongoose');

// Replace '<password>' with your actual MongoDB Atlas password
const uri = 'mongodb+srv://aadelakun28:Charisma%40101%2F@nachral.0mlmvu0.mongodb.net/natchura?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));*/


var app = express();

app.use(express.static(__dirname));

var server = app.listen(5000, () => {
    console.log('server is running on port', server.address().port);
   });



   // Attention: mongodb+srv://adesdeskdatabase01.7znhfhj.mongodb.net/myFirstDatabase" --apiVersion 1 --username adesdeskUser01