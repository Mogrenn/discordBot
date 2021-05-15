import { MusicPlayer } from "./musicPlayer";
import { HigherOrLower } from "./HigherOrLower";
import { CommandResolver } from "../types/types"
import * as Discord from "discord.js";
import { Message, VoiceChannel } from "discord.js";


const client = new Discord.Client();
const botChannel = "832950711691247636";
let player = new MusicPlayer();

client.on("ready", () => {
    console.log("ready");
});

client.on("message", async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.startsWith("!")) {
        let command:CommandResolver;
        if (msg.content.match(" ")) {
            command = {
                command: msg.content.split(" ")[0].trim(),
                arguments: msg.content.split(" ")[1].trim(),
                message:msg
            }
        } else {
            command = {
                command: msg.content,
                arguments: "",
                message:msg
            }
        }
        try {
            commandResolver(command);
        } catch (e) {
            console.warn(e)
            await msg.reply("Internal ERROR")
        }
    }
});

function commandResolver(command:CommandResolver) {
    let com:string = command.command.split("!")[1];
    let args:string = command.arguments;

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

function sendMessageToBotChannel(messageToUser:string) {
    //@ts-ignore selects the wrong type so it cant find send when it works
    client.channels.cache.get(botChannel).send(messageToUser);
}

function replyToAuthor(msg:Message, messageToUser:string) {
    msg.reply(messageToUser)
}

function playMusic(arg, channel:VoiceChannel) {
    sendMessageToBotChannel("Searching for song: "+arg);
    player.lookUpSong(arg, channel).then((res) =>  {
        if (res.success) {
            sendMessageToBotChannel("Playing song: "+res.data);
        } else {
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

function changeVolume(newVolume:number) {
    player.setVolume(newVolume);
}

function skipNextSong() {
    player.skipNextSong();
}

async function skipCurrentSong() {
    await player.skipCurrentSong();
}

function showQueue(msg:Message) {
    player.listQueue(msg);
}

//Cherrys bot
//client.login("NjM2MTQ4ODIzMzg2ODgyMDQ5.Xa7Zwg.xQCM0mIabdRmQ7uDA3ZTJq-xknY");
//Dev bot
client.login("ODMyOTAwMjYxMDY4NTM3ODY2.YHqg0A.xpQ1_UBCZoDW_yve7fbIxSfU4I4");