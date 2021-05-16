import {QueueSong} from "../types/types";
import * as Discord from "discord.js";

export class Queue {
    private readonly queue:Array<QueueSong>

    constructor() {
        this.queue = [];
    }

    addSong(song:QueueSong) {
        this.queue.push(song);
        return this.queue.length === 1;
    }

    getNextSong() {
        return this.queue[0];

    }

    async skipCurrentSong(): Promise<boolean> {
        this.queue.shift();
        return this.queue.length > 0;
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
                let songDetails = {name: "test", value: "test"};
                fields.push(songDetails);
            }
            queueEmbed.addFields(fields);
        }
        queueEmbed.addField("test", this.queue.length.toString()+" song(s) in queue | total length");
        return queueEmbed;
    }

    shuffleQueue() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
    }

    skipNextSong() {
        if (this.queue.length >= 2) {
            this.queue.splice(2);
        }
    }

    removeSpecificSongs(songPositions:Array<string>) {
        for (let i = 0; i < songPositions.length; i++) {
            this.removeSong(songPositions[i]+i);
        }
    }

    private removeSong(songPosition:string) {
        this.queue.splice(parseInt(songPosition));
    }

}