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
require("dotenv").config(); //Must add path for prod
const musicPlayer_1 = require("./musicPlayer");
const HigherOrLower_1 = require("./HigherOrLower");
const Discord = require("discord.js");
const database_1 = require("./database");
const roll_1 = require("./roll");
const client = new Discord.Client();
//const botChannel = "832950711691247636";
let player = new musicPlayer_1.MusicPlayer();
const db = new database_1.DataBaseAccess();
const higherOrLowerGames = [];
const rollGames = [];
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
            yield commandResolver(command);
        }
        catch (e) {
            console.warn(e);
            yield msg.reply("Internal ERROR");
        }
    }
}));
function commandResolver(command) {
    return __awaiter(this, void 0, void 0, function* () {
        let com = command.command.split("!")[1];
        let args = command.arguments;
        switch (com) {
            case 'test':
                yield sendMessageToBotChannel("test");
                break;
            case 'p':
            case 'play':
                yield playMusic(args, command.message.member.voice.channel);
                break;
            case 'leave':
                yield leaveVoiceChannel(command.message);
                break;
            case 'join':
                yield joinVoiceChannel(command.message);
                break;
            case 'volume':
                yield changeVolume(parseInt(args));
                break;
            case 'q':
            case 'queue':
                yield showQueue(command.message);
                break;
            case 'skipnext':
                yield skipNextSong();
                break;
            case 'skip':
                yield skipCurrentSong();
                break;
            case 'shuffle':
                yield shuffle();
                break;
            case 'remove':
                yield removeSpecificSongs(command.message, args);
                break;
            case 'hl':
            case 'higherorlower':
                higherOrLowerGames.push(new HigherOrLower_1.HigherOrLower(command.message));
                break;
            case 'g':
            case 'guess':
                yield playerGuess(command.message, args);
                break;
            case "signup":
                yield dbRequest(command.message);
                break;
            case "startRoll":
                yield startRollGame(command.message, args);
            default:
                break;
        }
    });
}
function sendMessageToBotChannel(messageToUser) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore selects the wrong type so it cant find send when it works
        //client.channels.cache.get(botChannel).send(messageToUser);
    });
}
function playerGuess(msg, args) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const game of higherOrLowerGames) {
            if ((yield game.getAuthor()) === msg.author) {
                yield game.playerGuess(args);
            }
        }
    });
}
function startRollGame(msg, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (rollGames.length === 0) {
            let arg = args.split(" ");
            rollGames.push(new roll_1.Roll({ min: parseInt(arg[0]), max: parseInt(arg[1]), amountOfPeople: parseInt(arg[2]), dbAccess: db }));
            yield msg.reply("Game has been created");
        }
        else {
            yield msg.reply("Wait until the game has finished");
        }
    });
}
function roll(msg, arg) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function replyToAuthor(msg, messageToUser) {
    return __awaiter(this, void 0, void 0, function* () {
        yield msg.reply(messageToUser);
    });
}
function playMusic(arg, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sendMessageToBotChannel("Searching for song: " + arg);
        player.lookUpSong(arg, channel).then((res) => {
            if (res.success) {
                sendMessageToBotChannel("Playing song: " + res.data);
            }
            else {
                sendMessageToBotChannel("Could not find song");
            }
        });
    });
}
function dbRequest(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield db.signUp({ discordId: msg.author.id, discordUsername: msg.author.username });
        if (result.success) {
            yield msg.reply("You have been sign up with a 500 credit bonus");
        }
        else {
            yield msg.reply("You can only sign up once");
        }
    });
}
function giveMoney() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function shuffle() {
    return __awaiter(this, void 0, void 0, function* () {
        player.shuffle();
    });
}
function leaveVoiceChannel(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        player.leave(msg.guild);
    });
}
function joinVoiceChannel(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        player.join(msg.member.voice.channel);
    });
}
function changeVolume(newVolume) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield player.setVolume(newVolume);
        if (response.success) {
            yield sendMessageToBotChannel("");
        }
    });
}
function skipNextSong() {
    return __awaiter(this, void 0, void 0, function* () {
        player.skipNextSong();
    });
}
function skipCurrentSong() {
    return __awaiter(this, void 0, void 0, function* () {
        yield player.skipCurrentSong();
    });
}
function showQueue(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield player.listQueue(msg);
    });
}
function removeSpecificSongs(msg, args) {
    return __awaiter(this, void 0, void 0, function* () {
        player.removeSpecificSongs(args.split(","));
    });
}
if (process.env.MODE === "dev") {
    client.login(process.env.DISCORD_API_TOKEN_DEV);
}
else if (process.env.MODE === "prod") {
    client.login(process.env.DISCORD_API_TOKEN_PROD);
}
//# sourceMappingURL=main.js.map