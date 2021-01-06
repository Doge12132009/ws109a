const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
 
// 加入線上人數計數
let onlineCount = 0;
 
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/index.html');
});
 
io.on('connection', (socket) => {
    
    onlineCount++;
    io.emit("online", onlineCount);
 
    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 1) return;
        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });
    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});