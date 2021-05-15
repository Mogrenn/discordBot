import {ResponseObject} from "../types/types";
import {Pool, PoolConnection} from "mariadb";

const mariadb = require('mariadb');

class DataBaseAccess {
    private pool:Pool;
    constructor(hostname = "localhost", username = "discord", password = "123", database = "discord") {
        this.pool = mariadb.createPool({host: hostname, user: username, password: password, database: database});
    }

    async Query(sql:string, args:Array<any>): Promise<ResponseObject>{
        let conn:PoolConnection;
        try {
            conn = await this.pool.getConnection();

            //TODO: Fix the last things here
            let result = await conn.query(sql,args);
            return {success: true, data: result}
        } catch(err) {
            return {success: false, error: err}
        } finally {
            if (conn) await conn.release();
        }
    }

}