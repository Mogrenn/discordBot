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
        this.newQueue = new Queue();
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
            let response:videoInfo = await ytdl.getBasicInfo(songLink);
            this.setChannel(channel);
            this.timeToNextSongInSeconds += parseInt(response.videoDetails.lengthSeconds);
            this.newQueue.addSong({title: response.videoDetails.title, link: songLink});
            this.joinChannelToPlayMusic();
            return { success: true, data: response.videoDetails.title }

        } catch (e) {
            console.error(e);
            return {success: false, error: e}
        }

    }

    async skipCurrentSong() {
        this.dispatcher.destroy();
        if (await this.newQueue.skipCurrentSong()) {
            await this.playMusic();
        } else {
            this.isPlaying = false;
        }
    }

    skipNextSong() {
        this.newQueue.skipNextSong();
    }

    joinChannelToPlayMusic() {
        this.channel.join().then(async (connection) => {
            this.connection = connection;
            await this.playMusic();
        })
    }

    async playMusic() {
        let newNextSong:QueueSong = this.newQueue.getNextSong();
        this.dispatcher = this.connection.play(await ytdl(newNextSong.link), {
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

    async listQueue(msg:Message) {
        await msg.channel.send(this.newQueue.listQueue());
    }

    isConnected() {
        return this.channel !== undefined;
    }

    setChannel(channel:VoiceChannel) {
        this.channel = channel;
    }

    setVolume(newVolume:number) {
        newVolume = newVolume > 100 ? 100 : newVolume;
        this.volume = newVolume * 0.001;
    }

}