"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const musicPlayer_1 = require("./musicPlayer");
const Discord = require("discord.js");
const client = new Discord.Client();
const botChannel = "832950711691247636";
let player = new musicPlayer_1.MusicPlayer();
client.on("ready", () => {
    console.log("ready");
});
client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
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
        try {
            commandResolver(command);
        }
        catch (e) {
            console.warn(e);
            yield msg.reply("Internal ERROR");
        }
    }
}));
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
            leaveVoiceChannel(command.message);
            break;
        case 'join':
            joinVoiceChannel(command.message);
            break;
        case 'volume':
            changeVolume(parseInt(args));
            break;
        case 'q':
        case 'queue':
            showQueue(command.message);
            break;
        case 'skipnext':
            skipNextSong();
            break;
        case 'skip':
            skipCurrentSong();
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
    //@ts-ignore selects the wrong type so it cant find send when it works
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
function leaveVoiceChannel(msg) {
    player.leave(msg.guild);
}
function joinVoiceChannel(msg) {
    player.join(msg.member.voice.channel);
}
function changeVolume(newVolume) {
    player.setVolume(newVolume);
}
function skipNextSong() {
    player.skipNextSong();
}
function skipCurrentSong() {
    return __awaiter(this, void 0, void 0, function* () {
        yield player.skipCurrentSong();
    });
}
function showQueue(msg) {
    player.listQueue(msg);
}
//Cherrys bot
//client.login("NjM2MTQ4ODIzMzg2ODgyMDQ5.Xa7Zwg.xQCM0mIabdRmQ7uDA3ZTJq-xknY");
//Dev bot
client.login("ODMyOTAwMjYxMDY4NTM3ODY2.YHqg0A.xpQ1_UBCZoDW_yve7fbIxSfU4I4");
//# sourceMappingURL=main.js.map