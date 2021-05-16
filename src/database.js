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
const mariadb = require('mariadb');
class DataBaseAccess {
    constructor(hostname = "localhost", username = "discord", password = "123", database = "discord") {
        this.pool = mariadb.createPool({ host: hostname, user: username, password: password, database: database });
    }
    Query(sql, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            try {
                conn = yield this.pool.getConnection();
                //TODO: Fix the last things here
                let result = yield conn.query(sql, args);
                return { success: true, data: result };
            }
            catch (err) {
                return { success: false, error: err };
            }
            finally {
                if (conn)
                    yield conn.release();
            }
        });
    }
}
//# sourceMappingURL=database.js.map