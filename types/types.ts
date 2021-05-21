import {Message} from "discord.js";

export interface CommandResolver {
    command: string,
    arguments: string,
    message: Message,
}

export interface QueueSong {
    title: string,
    link: string,
}

export interface Text {

}

export interface ResponseObject {
    success: boolean,
    data?: any,
    error?: string,
}

export interface SongsToBeRemoved {
    songList: {}
}

export interface DiscordUser {
    discordId: string,
    discordUsername: string,
}

export interface DiscordUserWithRoll extends DiscordUser {
    roll:number,
}

export interface DiscordUserWithBet extends DiscordUser {
    bet:number,
}
