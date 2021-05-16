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
exports.Queue = void 0;
const Discord = require("discord.js");
class Queue {
    constructor() {
        this.queue = [];
    }
    addSong(song) {
        this.queue.push(song);
        return this.queue.length === 1;
    }
    getNextSong() {
        return this.queue[0];
    }
    skipCurrentSong() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.shift();
            return this.queue.length > 0;
        });
    }
    listQueue() {
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
        return queueEmbed;
    }
    shuffleQueue() {
        this.queue.sort(() => Math.random() - 0.5);
    }
    skipNextSong() {
        if (this.queue.length >= 2) {
            this.queue.splice(2);
        }
    }
    removeSpecificSongs(songPositions) {
        for (let i = 0; i < songPositions.length; i++) {
            this.removeSong(songPositions[i] + i);
        }
    }
    removeSong(songPosition) {
        this.queue.splice(songPosition);
    }
    getSize() {
        return this.queue.length;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map