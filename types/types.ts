import {Message} from "discord.js";

export interface CommandResolver {
    command: string,
    arguments: string,
    message: Message
}

export interface QueueSong {
    title: string,
    link: string
}

export interface Text {

}

export interface ResponseObject {
    success: boolean,
    data?: any,
    error?: string
}

export interface SongsToBeRemoved {
    songList: {}
}
