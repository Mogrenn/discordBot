import {ResponseObject} from "../types/types";
import {Pool, PoolConnection} from "mariadb";

const mariadb = require('mariadb');

class DataBaseAccess {
    private pool:Pool;
    constructor() {
        this.pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DB});
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