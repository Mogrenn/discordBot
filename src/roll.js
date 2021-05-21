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
exports.Roll = void 0;
class Roll {
    constructor(args) {
        this.min = args.min;
        this.max = args.max;
        this.amountOfPeople = args.amountOfPeople;
        this.betPool = [];
        this.dbAccess = args.dbAccess;
        this.guessNumber = this.initNumber(args.min, args.max);
        this.closestUser = undefined;
        this.peopleThatHaveGuessed = [];
    }
    initNumber(min, max) {
        return Math.floor(Math.random() * max) + min;
    }
    roll(bet, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.peopleThatHaveGuessed.filter(u => u.discordId === msg.author.id)) {
                yield msg.reply("You have already played wait for next round");
                return;
            }
            let res = yield this.dbAccess.checkForAssets({ discordId: msg.author.id, discordUsername: msg.author.username });
            if (res.success) {
                if (res.data) {
                    if (bet < res.data[0].assets) {
                        this.betPool.push({ bet: bet, discordId: msg.author.id, discordUsername: msg.author.username });
                        if (this.closestUser === undefined) {
                            this.closestUser = { discordUsername: msg.author.username, discordId: msg.author.id, roll: yield this.rollANumber() };
                            this.peopleThatHaveGuessed.push({ discordId: msg.author.id, discordUsername: msg.author.username });
                        }
                        else {
                            let currentUserRoll = yield this.rollANumber();
                            if (Math.abs(currentUserRoll - this.guessNumber) > Math.abs(this.closestUser.roll - this.guessNumber)) {
                                this.closestUser = { discordUsername: msg.author.username, discordId: msg.author.id, roll: currentUserRoll };
                                this.peopleThatHaveGuessed.push({ discordId: msg.author.id, discordUsername: msg.author.username });
                                yield msg.reply("You are in the lead with " + currentUserRoll.toString());
                            }
                            else {
                                yield msg.reply("You failed with " + currentUserRoll.toString());
                            }
                        }
                        if (bet.length === this.amountOfPeople) {
                            yield this.end();
                        }
                    }
                    else {
                        yield msg.reply("Get some money bich");
                    }
                }
            }
            else {
                yield msg.reply("Do you even have money dude? try !signup");
            }
        });
    }
    rollANumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.initNumber(this.min, this.max);
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            let losers = this.betPool.filter(u => u.discordId !== this.closestUser.discordId);
            let res = yield this.dbAccess.payoutBet(this.closestUser, losers);
            if (res.success) {
                //TODO: Add a message here
            }
            else {
                //TODO: Add a error message here
            }
        });
    }
}
exports.Roll = Roll;
//# sourceMappingURL=roll.js.map