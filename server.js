const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usernames = {};
const rooms = [
    {name: "globalChat", creator: "Anonymous"},
    {name: "chess", creator: "Anonymous"},
    {name: "javascript", creator: "Anonymous"},
]; 

io.on("connection", function(socket) {
    console.log(`User connected to server.`);

    socket.on("createUser", function(username) {
        socket.username = username;
        usernames[username] = username;
        socket.currentRoom = "globalChat";

        socket.join("globalChat");
        console.log(`User ${username} created on server successfully`);
        socket.emit("updateChat", "INFO", "You have joined globalChat room");

        socket.on("sendMessage", function(data) {
            io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data)
        })
    })
})


app.use(express.static("public"));

server.listen(4000, function() {
    console.log(`server running at port 4000`);
})

