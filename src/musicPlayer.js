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
const queue_1 = require("./queue");
class MusicPlayer {
    constructor() {
        this.volume = 0.1;
        this.newQueue = new queue_1.Queue();
        this.isPlaying = false;
        this.dispatcher = undefined;
        this.loopCurrentSong = false;
    }
    leave(me) {
        me.voice.channel.leave();
        this.channel = undefined;
    }
    join(channel) {
        this.channel = channel;
        this.channel.join().then(() => { });
    }
    //TODO: videoDetails type has field lengthInSeconds, make timer with that
    lookUpSong(songLink, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield ytdl.getBasicInfo(songLink);
                this.setChannel(channel);
                this.timeToNextSongInSeconds += parseInt(response.videoDetails.lengthSeconds);
                if (this.newQueue.addSong({ title: response.videoDetails.title, link: songLink })) {
                    this.joinChannelToPlayMusic();
                }
                return { success: true, data: response.videoDetails.title };
            }
            catch (e) {
                console.error(e);
                return { success: false, error: e };
            }
        });
    }
    skipCurrentSong() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispatcher.destroy();
            if (yield this.newQueue.skipCurrentSong()) {
                yield this.playMusic();
            }
            else {
                this.isPlaying = false;
            }
        });
    }
    skipNextSong() {
        this.newQueue.skipNextSong();
    }
    joinChannelToPlayMusic() {
        this.channel.join().then((connection) => __awaiter(this, void 0, void 0, function* () {
            this.connection = connection;
            yield this.playMusic();
        }));
    }
    playMusic() {
        return __awaiter(this, void 0, void 0, function* () {
            let nextSong = this.newQueue.getNextSong();
            this.dispatcher = this.connection.play(yield ytdl(nextSong.link), {
                type: "opus",
                volume: this.volume
            }).on("start", () => {
            }).on("finish", () => {
                if (this.newQueue.skipCurrentSong()) {
                    this.playMusic();
                }
                else {
                    this.isPlaying = false;
                }
            }).on("error", (error) => {
                console.error(error);
            });
        });
    }
    listQueue(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield msg.channel.send(this.newQueue.listQueue());
        });
    }
    isConnected() {
        return this.channel !== undefined;
    }
    shuffle() {
        this.newQueue.shuffleQueue();
    }
    setChannel(channel) {
        this.channel = channel;
    }
    removeSpecificSongs(songPositions) {
        this.newQueue.removeSpecificSongs(songPositions);
    }
    setVolume(newVolume) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempNewVolume = newVolume > 100 ? 100 : newVolume;
            console.log(tempNewVolume);
            if (this.isPlaying) {
                this.dispatcher.setVolume(newVolume);
                console.log("test2");
            }
            this.volume = tempNewVolume * 0.001;
            return { success: true, data: this.volume / 0.001 };
        });
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=musicPlayer.js.map