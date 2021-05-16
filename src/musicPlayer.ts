import * as ytdl from "ytdl-core-discord";
import {GuildMember, StreamDispatcher, VoiceChannel, VoiceConnection, Message} from "discord.js";
import {QueueSong, ResponseObject} from "../types/types";
import {videoInfo} from "ytdl-core";
import {Queue} from "./queue";

export class MusicPlayer {
    private channel: VoiceChannel | undefined;
    private connection:VoiceConnection;
    private volume: number;
    private newQueue:Queue;
    private isPlaying:boolean;
    private timeToNextSongInSeconds:number;
    private dispatcher: StreamDispatcher | undefined;
    private loopCurrentSong: boolean;

    constructor() {
        this.volume = 0.1;
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
            if (this.newQueue.addSong({title: response.videoDetails.title, link: songLink})) {
                this.joinChannelToPlayMusic();
            }
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
        let nextSong:QueueSong = this.newQueue.getNextSong();
        this.dispatcher = this.connection.play(await ytdl(nextSong.link), {
            type: "opus",
            volume: this.volume
        }).on("start", () => {

        }).on("finish", () => {
            if (this.newQueue.skipCurrentSong()) {
                this.playMusic();
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

    shuffle() {
        this.newQueue.shuffleQueue();
    }

    setChannel(channel:VoiceChannel) {
        this.channel = channel;
    }

    removeSpecificSongs(songPositions:Array<string>) {
        this.newQueue.removeSpecificSongs(songPositions);
    }

    async setVolume(newVolume:number): Promise<ResponseObject> {
        newVolume = newVolume > 100 ? 100 : newVolume;
        this.volume = newVolume * 0.001;
        return {success: true, data: this.volume/0.001}
    }

}