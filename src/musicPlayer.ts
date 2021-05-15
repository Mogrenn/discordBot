import * as ytdl from "ytdl-core-discord";
import {GuildMember, StreamDispatcher, VoiceChannel, VoiceConnection, Message} from "discord.js";
import {QueueSong, ResponseObject} from "../types/types";
import {videoInfo} from "ytdl-core";
import * as Discord from "discord.js";
import {Queue} from "./queue";

export class MusicPlayer {
    private channel: VoiceChannel | undefined;
    private connection:VoiceConnection;
    private volume: number;
    private readonly queue: Array<QueueSong>;
    private newQueue:Queue;
    private isPlaying:boolean;
    private timeToNextSongInSeconds:number;
    private dispatcher: StreamDispatcher | undefined;
    private loopCurrentSong: boolean;

    constructor() {
        this.volume = 0.1;
        this.queue = [];
        this.isPlaying = false;
        this.dispatcher = undefined;
        this.loopCurrentSong = false;
    }

    leave(me:GuildMember) {
        me.voice.channel.leave();
        this.channel = undefined;
    }

    join(channel:VoiceChannel) {
        this.channel = channel;
        this.channel.join().then(() => {});
    }

    //TODO: videoDetails type has field lengthInSeconds, make timer with that
    async lookUpSong(songLink:string, channel:VoiceChannel) : Promise<ResponseObject> {
        try {
            let response:videoInfo = await ytdl.getBasicInfo(songLink).then((res) => {
                this.setChannel(channel);
                this.timeToNextSongInSeconds += res.videoDetails.lengthSeconds;
                this.newQueue.addSong({title: res.videoDetails.title, link: songLink});
                this.addSongToQueue({title: res.videoDetails.title, link: songLink});
                return res;
            });

            return { success: true, data: response.videoDetails.title }

        } catch (e) {
            console.error(e);
            return {success: false, error: e}
        }

    }

    private addSongToQueue(song:QueueSong) {

        this.queue.push(song);


        if (!this.isPlaying) {
            this.isPlaying = true;
            this.joinChannelToPlayMusic();
        }
}

    listQueue(msg:Message) {
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
        msg.channel.send(queueEmbed);
    }

    skipCurrentSong() {
        this.dispatcher.destroy();
        this.queue.shift();
        if (this.queue.length > 0) {
            this.playMusic();
        } else {
            this.isPlaying = false;
        }
    }

    skipNextSong() {
        if (this.queue.length >= 2) {
            this.queue.splice(2);
        }
    }

    getNextSong() : QueueSong {
        let nextSong:QueueSong = this.queue[0];
        return nextSong;
    }

    joinChannelToPlayMusic() {
        this.channel.join().then(async (connection) => {
            this.connection = connection;
            await this.playMusic();
        })
    }

    async playMusic() {
        let nextSong:QueueSong = this.getNextSong();
        this.dispatcher = this.connection.play(await ytdl(nextSong.link), {
            type: "opus",
            volume: this.volume
        }).on("start", () => {

        }).on("finish", () => {
            if (this.queue.length > 0) {
                this.queue.shift();
            } else {
                this.isPlaying = false;
            }
        }).on("error", (error) => {
            console.error(error);
        });

    }

    isConnected() {
        if (this.channel !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    setChannel(channel:VoiceChannel) {
        this.channel = channel;
    }

    setVolume(newVolume:number) {
        newVolume = newVolume > 100 ? 100 : newVolume;
        this.volume = newVolume * 0.001;
    }

}