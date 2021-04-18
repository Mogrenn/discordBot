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
    listQueue() {
    }
    skipCurrentSong() {
        this.dispatcher.destroy();
    }
    skipNextSong() {
        if (this.queue.length >= 2) {
            this.queue.splice(2);
        }
    }
    getNextSong() {
        let nextSong = this.queue[0];
        this.queue.shift();
        return nextSong;
    }
    joinChannelToPlayMusic() {
        this.channel.join().then((connection) => __awaiter(this, void 0, void 0, function* () {
            yield this.playMusic(connection);
        }));
    }
    playMusic(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let nextSong = this.getNextSong();
            this.dispatcher = connection.play(yield ytdl(nextSong.link), {
                type: "opus",
                volume: this.volume
            }).on("start", () => {
            }).on("finish", () => {
                if (this.queue.length > 0) {
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
        this.volume = newVolume * 0.001;
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=musicPlayer.js.map