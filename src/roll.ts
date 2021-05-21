import {DataBaseAccess} from "./database";
import {Message} from "discord.js";
import {DiscordUser, DiscordUserWithBet, DiscordUserWithRoll, ResponseObject} from "../types/types";


export class Roll {
    private readonly min:number; max:number; amountOfPeople:number; guessNumber:number;
    private betPool:Array<DiscordUserWithBet>;
    private closestUser:DiscordUserWithRoll|undefined;
    private readonly dbAccess:DataBaseAccess;
    private peopleThatHaveGuessed:Array<DiscordUser>;

    constructor(args:{min:number, max:number, amountOfPeople:number, dbAccess:DataBaseAccess}) {
        this.min = args.min;
        this.max = args.max;
        this.amountOfPeople = args.amountOfPeople;
        this.betPool = [];
        this.dbAccess = args.dbAccess;
        this.guessNumber = this.initNumber(args.min, args.max)
        this.closestUser = undefined;
        this.peopleThatHaveGuessed = [];
    }

    initNumber(min:number, max:number): number {
        return Math.floor(Math.random()* max) + min;
    }

    async roll(bet, msg:Message) {
        if (this.peopleThatHaveGuessed.filter(u => u.discordId === msg.author.id)) {
            await msg.reply("You have already played wait for next round")
            return;
        }

        let res = await this.dbAccess.checkForAssets({discordId:msg.author.id, discordUsername: msg.author.username});

        if(res.success) {
            if (res.data) {
                if (bet < res.data[0].assets) {
                    this.betPool.push({bet: bet, discordId: msg.author.id, discordUsername: msg.author.username});

                    if (this.closestUser === undefined) {
                        this.closestUser = {discordUsername: msg.author.username, discordId: msg.author.id, roll: await this.rollANumber()}
                        this.peopleThatHaveGuessed.push({discordId: msg.author.id, discordUsername: msg.author.username});
                    } else {
                        let currentUserRoll = await this.rollANumber();
                        if (Math.abs(currentUserRoll - this.guessNumber) > Math.abs(this.closestUser.roll - this.guessNumber)) {
                            this.closestUser = {discordUsername: msg.author.username, discordId: msg.author.id, roll: currentUserRoll}
                            this.peopleThatHaveGuessed.push({discordId: msg.author.id, discordUsername: msg.author.username});
                            await msg.reply("You are in the lead with "+currentUserRoll.toString())
                        } else {
                            await msg.reply("You failed with "+currentUserRoll.toString())
                        }
                    }
                    if (bet.length === this.amountOfPeople) {
                        await this.end();
                    }
                } else {
                    await msg.reply("Get some money bich");
                }
            }
        } else {
            await msg.reply("Do you even have money dude? try !signup");
        }
    }

    async rollANumber(): Promise<number> {
        return this.initNumber(this.min, this.max);
    }

   async end() {
        let losers = this.betPool.filter(u => u.discordId !== this.closestUser.discordId);
        let res = await this.dbAccess.payoutBet(this.closestUser as DiscordUser, losers);

        if (res.success) {
            //TODO: Add a message here
        } else {
            //TODO: Add a error message here
        }
    }
}
