const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord");
const client = new Discord.Client();
let queue = [];
let volume = 0.1;
let isPlaying = false;

const Text = {
    userNotInChannel: "Your not in a voice channel"
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

    if (command.match(new RegExp("https"))) {
        command = "!play";
    }
    switch (command.split("!")[1]) {
        case 'test':
            replyToAuthor(msg);
            break;
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
        default:
            msg.channel.send("You are an idiot");
            break;
    }
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

function getNextSong() {
    if (queue.length > 0) {
        let nextSong = queue[0];
        queue.shift();
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
        if (!isPlaying)
            isPlaying = true;
    }).on("finish", () => {
        isPlaying = false;
        if (queue.length > 0) {
            playMusic(connection);
        }
        //channel.guild.me.voice.channel.leave();
    }).on("error", (error) => {
        console.error(error);
    })
}

function checkIfUserInChannel(msg) {
    if (!msg.member.voice.channel)
        return false;
    else {
        return true
    }
}

function changeVolume(msg) {
    if (!checkIfUserInChannel(msg)) return msg.channel.send(Text.userNotInChannel);

    let newVolume = parseFloat(msg.content.split(" ")[0]) * 0.001;
    volume = newVolume;
}

client.login("ODMyOTAwMjYxMDY4NTM3ODY2.YHqg0A.xpQ1_UBCZoDW_yve7fbIxSfU4I4");
