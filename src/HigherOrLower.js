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
exports.HigherOrLower = void 0;
const enums_1 = require("../types/enums");
class HigherOrLower {
    constructor(msg) {
        this.msg = msg;
        this.author = msg.author;
        this.initNumber = this.generateNumber();
        this.init();
    }
    init() {
        this.msg.reply(`Higher or Lower ${this.initNumber}`);
    }
    playerGuess(guess) {
        return __awaiter(this, void 0, void 0, function* () {
            let nextNumber = this.generateNumber();
            if (guess.toLowerCase() === "higher" && nextNumber > this.initNumber) {
                yield this.msg.reply(enums_1.Text.uSuckLittle);
            }
            else if (guess.toLowerCase() === "lower" && nextNumber < this.initNumber) {
                yield this.msg.reply(enums_1.Text.uSuckLittle);
            }
            else {
                yield this.msg.reply(enums_1.Text.uSuckAlotOfDick);
            }
        });
    }
    getAuthor() {
        return this.author;
    }
    generateNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }
}
exports.HigherOrLower = HigherOrLower;
//# sourceMappingURL=HigherOrLower.js.map