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
            yield this.Query(`
            INSERT INTO user
                (discord_id, username)
            VALUES(?, ?)
        `, [args.discordId, args.discordUsername]);
        });
    }
}
exports.DataBaseAccess = DataBaseAccess;
//# sourceMappingURL=database.js.map