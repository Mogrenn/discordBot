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
exports.DataBaseAccess = void 0;
const mariadb = require('mariadb');
class DataBaseAccess {
    constructor() {
        this.pool = mariadb.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DB });
    }
    Query(sql, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            try {
                conn = yield this.pool.getConnection();
                let result = yield conn.query(sql, args);
                if (result.length > 0) {
                    return { success: true, data: result, rowcount: result.length };
                }
                else {
                    return { success: true, data: [], rowcount: 0 };
                }
            }
            catch (err) {
                return { success: false, data: err, rowcount: 0 };
            }
            finally {
                if (conn)
                    yield conn.release();
            }
        });
    }
    signUp(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.Query(`
            INSERT INTO 
                user
                    (discord_id, username)
            VALUES
                (?, ?)
        `, [args.discordId, args.discordUsername]);
            if (result.success) {
                return { success: true };
            }
            else {
                return { success: false, error: "You can only sign up once" };
            }
        });
    }
    checkForAssets(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.Query(`
            SELECT
                sum(amount) as assets
            FROM
                transaction_history
            WHERE
                discord_id = ?
        `, [args.discordId]);
            if (result.success) {
                if (result.rowcount > 0) {
                    return { success: true, data: result.data };
                }
            }
            else {
                return { success: false, error: "Something when wrong" };
            }
        });
    }
    payoutBet(winner, losers) {
        return __awaiter(this, void 0, void 0, function* () {
            let winnerPrize = losers.map(u => { return u.bet; }).reduce((a, b) => a + b, 0);
            let entries = `(${winner.discordId}, ${winnerPrize}),`;
            losers.map((u) => {
                entries += `(${u.discordId}, ${-u.bet}),`;
            });
            let res = yield this.Query(`
            INSERT INTO
                transaction_history
                    (discord_id, amount),
            VALUES
                ?
        `, [entries]);
            if (res.success) {
                return { success: true };
            }
            else {
                return { success: false };
            }
        });
    }
    sendTransaction(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.Query(`
            INSERT INTO 
                transaction_history
                    (discord_id, amount)
            VALUES
                (?,?)
        `, [args.DiscordUser, args.amount]);
            if (result.success) {
                return { success: true };
            }
            else {
                return { success: false, error: result.data[0] };
            }
        });
    }
}
exports.DataBaseAccess = DataBaseAccess;
//# sourceMappingURL=database.js.map