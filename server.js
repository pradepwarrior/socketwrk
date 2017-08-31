var express = require('express')
var app = express()
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/mywrk', function (err) {
    if (err) {
        console.log('error to connecet database' + err)
    }
    else {
        console.log('db connected')
    }
})


app.use(express.static(__dirname + '/public'))
var client = require('socket.io')(server);
server.listen(8085, function () {
    console.log('Server running on 8085');
});
var userSchema = mongoose.Schema({
    message: String,
});
//var connection = mongoose.connection;
//connection.on('error', console.error.bind(console, 'connection error:'));
//console.log(connection)

var vUserDts = mongoose.model('users', userSchema);

client.on('connection', function (socket) {                         //client connected

    sendStatus = function (s) {
        socket.emit('status', s);                                   //emit true message
       // console.log(s)
    };
    socket.on('input', function (data) {
        var message = data.message;
        vUserDts.create({ message: message }, function () {
            client.emit('output', [data]);                          //emit output value
         //   console.log(data)
            sendStatus({
                message: "Message sent",
                clear: true
            });
        });
    })

    //var stream = vUserDts.find().limit(10).stream();              //to limit data
   // var streams = vUserDts.find().stream();
   //streams.on('data', function (chat) {
    vUserDts.find().stream().on('data', function (chat) {
     socket.emit('chat', chat);
        console.log(chat.message)
    });




    socket.on('disconnect', function () {
        console.log('user disconnected');
    });



})

var path = require('path')
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'))
})
