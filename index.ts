require("dotenv").config();

const TOKEN: string | undefined = process.env.tgToken;
const PORT: string | 3000 = process.env.PORT || 3000;
const DOMAIN: string | undefined = process.env.DOMAIN

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, { polling: true })

const { io } = require("socket.io-client");
const socketClient = io.connect(`${DOMAIN}:${PORT}`, { reconnect: true });

type anyObject = {
    [key: string]: any
}

bot.on("message", (msg: anyObject) => {
    // bot.sendMessage(msg.chat.id, "Ищем", {
    //     "reply_markup": {
    //         "keyboard": [["Искать собеседника"]],
    //         "resize_keyboard": true
    //     }
    // });
    socketClient.emit("setup", msg)
})


const server = require('http').createServer();
const ioServer = require('socket.io')(server);

ioServer.on('connection', (socket: anyObject) => {

    socket.on("setup", (userData: anyObject) => {
        const { first_name, last_name } = userData.from;
        const { text } = userData;
        console.log(first_name + ' ' + last_name + ' | ' + text + ' | ' + new Date().toLocaleString());
        console.log(socket.users);

    });

});


server.listen(PORT, () => {
    console.log("Server listening on port " + PORT)
});
