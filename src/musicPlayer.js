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
exports.MusicPlayer = void 0;
const ytdl = require("ytdl-core-discord");
const Discord = require("discord.js");
class MusicPlayer {
    constructor() {
        this.volume = 0.1;
        this.queue = [];
        this.isPlaying = false;
        this.dispatcher = undefined;
    }
    leave(me) {
        me.voice.channel.leave();
        this.channel = undefined;
    }
    //TODO: videoDetails type has field lengthInSeconds, make timer with that
    lookUpSong(songLink, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield ytdl.getBasicInfo(songLink).then((res) => {
                    this.setChannel(channel);
                    this.timeToNextSongInSeconds += res.videoDetails.lengthSeconds;
                    this.addSongToQueue({ title: res.videoDetails.title, link: songLink });
                    return res;
                });
                return { success: true, data: response.videoDetails.title };
            }
            catch (e) {
                console.error(e);
                return { success: false, error: e };
            }
        });
    }
    addSongToQueue(song) {
        this.queue.push(song);
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.joinChannelToPlayMusic();
        }
    }
    listQueue(msg) {
        let queueEmbed = new Discord.MessageEmbed()
            .setColor("#89cff0")
            .setTitle("Current Queue");
        queueEmbed.addField("Now Playing:", this.queue[0].title)
            .setURL(this.queue[0].link);
        if (this.queue.length > 0) {
            let fields = [];
            for (let i = 1; i < this.queue.length; i++) {
                let songDetails = { name: "test", value: "test" };
                fields.push(songDetails);
            }
            queueEmbed.addFields(fields);
        }
        queueEmbed.addField("test", this.queue.length.toString() + " song(s) in queue | total length");
        msg.channel.send(queueEmbed);
    }
    skipCurrentSong() {
        this.dispatcher.destroy();
        this.queue.shift();
        if (this.queue.length > 0) {
            this.playMusic();
        }
        else {
            this.isPlaying = false;
        }
    }
    skipNextSong() {
        if (this.queue.length >= 2) {
            this.queue.splice(2);
        }
    }
    getNextSong() {
        let nextSong = this.queue[0];
        return nextSong;
    }
    joinChannelToPlayMusic() {
        this.channel.join().then((connection) => __awaiter(this, void 0, void 0, function* () {
            this.connection = connection;
            yield this.playMusic();
        }));
    }
    playMusic() {
        return __awaiter(this, void 0, void 0, function* () {
            let nextSong = this.getNextSong();
            this.dispatcher = this.connection.play(yield ytdl(nextSong.link), {
                type: "opus",
                volume: this.volume
            }).on("start", () => {
            }).on("finish", () => {
                if (this.queue.length > 0) {
                    this.queue.shift();
                }
                else {
                    this.isPlaying = false;
                }
            }).on("error", (error) => {
                console.error(error);
            });
        });
    }
    isConnected() {
        if (this.channel !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    setChannel(channel) {
        this.channel = channel;
    }
    setVolume(newVolume) {
        newVolume = newVolume > 100 ? 100 : newVolume;
        this.volume = newVolume * 0.001;
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=musicPlayer.js.map