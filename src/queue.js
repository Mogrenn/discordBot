"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const Discord = require("discord.js");
class Queue {
    constructor() {
        this.queue = [];
    }
    addSong(song) {
        this.queue.push(song);
    }
    getNextSong() {
        return this.queue[0];
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
    }
    skipNextSong() {
        this.queue.splice(2);
    }
    removeSpecificSongs(songPositions) {
    }
    getSize() {
        return this.queue.length;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map