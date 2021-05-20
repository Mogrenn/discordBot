import {Pool, PoolConnection} from "mariadb";

const mariadb = require('mariadb');

export class DataBaseAccess {
    private readonly pool:Pool;
    constructor() {
        this.pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DB});
    }

    async Query<Type>(sql:string, args?:Array<string>): Promise<{data: Array<Type>, rowcount:number, success: boolean}>{
        let conn:PoolConnection;
        try {
            conn = await this.pool.getConnection();

            let result = await conn.query(sql,args);

            if (result.length > 0) {
                return {success: true, data: result, rowcount: result.length}
            }

        } catch(err) {
            return {success: false, data: err, rowcount: 0}
        } finally {
            if (conn) await conn.release();
        }
    }

    async signUp(args:{discordId:string, discordUsername:string}) {
        await this.Query(`
            INSERT INTO user
                (discord_id, username)
            VALUES(?, ?)
        `, [args.discordId, args.discordUsername]);
    }

}
