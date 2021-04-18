"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const musicPlayer_1 = require("./musicPlayer");
const Discord = require("discord.js");
const client = new Discord.Client();
const botChannel = "832950711691247636";
let player = new musicPlayer_1.MusicPlayer();
client.on("ready", () => {
    console.log("ready");
});
client.on("message", (msg) => {
    if (msg.author.bot)
        return;
    if (msg.content.startsWith("!")) {
        let command;
        if (msg.content.match(" ")) {
            command = {
                command: msg.content.split(" ")[0].trim(),
                arguments: msg.content.split(" ")[1].trim(),
                message: msg
            };
        }
        else {
            command = {
                command: msg.content,
                arguments: "",
                message: msg
            };
        }
        commandResolver(command);
    }
});
function commandResolver(command) {
    let com = command.command.split("!")[1];
    let args = command.arguments;
    switch (com) {
        case 'test':
            sendMessageToBotChannel("test");
            break;
        case 'p':
        case 'play':
            playMusic(args, command.message.member.voice.channel);
            break;
        case 'leave':
            break;
        case 'join':
            break;
        case 'volume':
            break;
        case 'q':
        case 'queue':
            break;
        case 'skipnext':
            break;
        case 'hl':
        case 'higherorlower':
            break;
        case 'g':
        case 'guess':
            break;
        default:
            break;
    }
}
function sendMessageToBotChannel(messageToUser) {
    //@ts-ignore
    client.channels.cache.get(botChannel).send(messageToUser);
}
function replyToAuthor(msg, messageToUser) {
    msg.reply(messageToUser);
}
function playMusic(arg, channel) {
    sendMessageToBotChannel("Searching for song: " + arg);
    player.lookUpSong(arg, channel).then((res) => {
        if (res.success) {
            sendMessageToBotChannel("Playing song: " + res.data);
        }
        else {
            sendMessageToBotChannel("Could not find song");
        }
    });
}
client.login("ODMyOTAwMjYxMDY4NTM3ODY2.YHqg0A.xpQ1_UBCZoDW_yve7fbIxSfU4I4");
//# sourceMappingURL=main.js.map