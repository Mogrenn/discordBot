const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord");
const mariadb = require('mariadb');
const client = new Discord.Client();
const db = new DataBaseAccess();
const botChannel = "832950711691247636";
let queue = [];
let volume = 0.1;
let isPlaying = false;
let gamblers = [];

const Text = {
    userNotInChannel: "Your not in a voice channel",
    uSuckLittle: "You suck a little dick",
    uSuckAlotOfDick: "You suck alot of dick"
}

client.on("ready", () => {
    console.log("ready");
});

client.on("message", (msg) => {

    if (msg.author.bot) return;

    if (msg.content.startsWith("!")) {
        commandResolver(msg.content, msg);
    }

});

function commandResolver(command, msg) {

    //TODO: Refactor this to be more useful
    if (command.match(new RegExp("https"))) {
        command = "!play";
    }

    if (command.match(new RegExp(" "))) {
        command = command.split(" ")[0];

    }

    switch (command.split("!")[1]) {
        case 'test':
            sendMessageToBotChannel(msg);
            break;
        case 'p':
        case 'play':
            addSongToQueue(msg);
            break;
        case 'leave':
            leave(msg);
            break;
        case 'join':
            join(msg)
            break;
        case 'volume':
            changeVolume(msg);
            break;
        case 'q':
        case 'queue':
            listQueue();
            break;
        case 'skipnext':
            skipNextSong();
            break;
        case 'hl':
        case 'higherorlower':
            higherOrLower(msg);
            break;
        case 'g':
        case "guess":
            guess(msg);
            break;
        default:
            msg.channel.send("You are an idiot");
            break;
    }
}

//TODO: finish this
function helpCommand() {

}

function sendMessageToBotChannel(message) {
    client.channels.cache.get(botChannel).send(message);
}

function replyToAuthor(msg) {
    msg.reply("You suck")
}

function join(msg) {
    if (!checkIfUserInChannel(msg)) return msg.channel.send(Text.userNotInChannel);
    msg.member.voice.channel.join().then((connection) => {
        console.log("joined");
    })
}

function leave(msg) {
    if (!msg.guild.me.voice.channel) return msg.channel.send("FUCK OFF");
    msg.guild.me.voice.channel.leave();
}

function addSongToQueue(msg) {
    if (!checkIfUserInChannel(msg)) return msg.channel.send(Text.userNotInChannel);
    let ytLink = msg.content.split(" ")[1];
    let channel = msg.member.voice.channel;
    queue.push(ytLink);
    if (!isPlaying) {
        joinChannelToPlayMusic(channel);
    }
}

function listQueue() {
    let songList = "";

}

function skipNextSong() {
    queue.shift();
}

function getNextSong() {
    if (queue.length > 0) {
        let nextSong = queue[0];
        return nextSong;
    }
}

function joinChannelToPlayMusic(channel) {

    channel.join().then(async (connection) => {
        await playMusic(connection);
    });
}

async function playMusic(connection) {
    let nextSong = getNextSong();
    let dispatcher = connection.play(await ytdl(nextSong), {
        type: "opus",
        volume: volume
    }).on("start", () => {
        sendMessageToBotChannel(`\`\`\`Playing a song now\`\`\``);
        if (!isPlaying)
            isPlaying = true;
    }).on("finish", () => {
        isPlaying = false;
        queue.shift()
        if (queue.length > 0) {
            playMusic(connection);
        }
        //channel.guild.me.voice.channel.leave();
    }).on("error", (error) => {
        console.error(error);
    })
}

function higherOrLower(msg) {
    gamblers.push(new HigherOrLower(msg));
}

function guess(msg) {

    for (const player of gamblers) {
        if (msg.author === player.getAuthor()) {
            let guess = msg.content.split(" ")[1];
            player.playerGuess(guess);
            gamblers.splice(player);
        }
    }
}

function checkIfUserInChannel(msg) {
    return msg.member.voice.channel;
}

function changeVolume(msg) {
    if (!checkIfUserInChannel(msg)) return msg.channel.send(Text.userNotInChannel);

    let newVolume = parseFloat(msg.content.split(" ")[0]) * 0.001;
    volume = newVolume;
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

//TODO: Add money to this that people can gamble with
class HigherOrLower {
    constructor(msg) {
        this.msg = msg;
        this.author = msg.author;
        this.initNumber = this.generateNumber();
        this.init();
    }

    init() {
        this.msg.reply(`Higher or Lower ${this.initNumber}`);
    }

    playerGuess(guess) {
        let nextNumber = generateRandomNumber();
        if (guess.toLowerCase() === "higher" && nextNumber > this.initNumber) {
            this.msg.reply(Text.uSuckLittle);
        } else if (guess.toLowerCase() === "lower" && nextNumber < this.initNumber) {
            this.msg.reply(Text.uSuckLittle);
        } else {
            this.msg.reply(Text.uSuckAlotOfDick);
        }
    }

    getAuthor() {
        return this.author;
    }

    generateNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }
}

class DataBaseAccess {

    constructor(hostname = "localhost", username = "root", password = "", database = "discord") {
        this.pool = mariadb.createPool({host: hostname, user: username, password: password, database: database});
    }

    async Query(sql, args) {
        let conn;
        try {
            conn = await this.pool.getConnection();

            //TODO: Fix the last things here
        } catch(err) {
            throw err;
        } finally {
            if (conn) await conn.release();
        }
    }

}

//TODO: Finish this
class Poker {

}

client.login("ODMyOTAwMjYxMDY4NTM3ODY2.YHqg0A.xpQ1_UBCZoDW_yve7fbIxSfU4I4");
