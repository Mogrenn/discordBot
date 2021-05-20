import {Message, User} from "discord.js";
import {Text} from "../types/enums";

export class HigherOrLower {
    private msg:Message;
    private readonly author:User;
    private readonly initNumber:number;
    constructor(msg:Message) {
        this.msg = msg;
        this.author = msg.author;
        this.initNumber = this.generateNumber();
        this.init();
    }

    async init() {
        await this.msg.reply(`Higher or Lower ${this.initNumber}`);
    }

    async playerGuess(guess) {
        let nextNumber = this.generateNumber();
        if (guess.toLowerCase() === "higher" && nextNumber > this.initNumber) {
            await this.msg.reply(Text.uSuckLittle);
        } else if (guess.toLowerCase() === "lower" && nextNumber < this.initNumber) {
            await this.msg.reply(Text.uSuckLittle);
        } else {
            await this.msg.reply(Text.uSuckAlotOfDick);
        }
    }

    async getAuthor() {
        return this.author;
    }

    generateNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

}
