import {Pool, PoolConnection} from "mariadb";
import {DiscordUser, DiscordUserWithBet, ResponseObject} from "../types/types";

const mariadb = require('mariadb');

export class DataBaseAccess {
    private readonly pool:Pool;
    constructor() {
        this.pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DB});
    }

    private async Query<Type>(sql:string, args?:Array<string>): Promise<{data: Array<Type>, rowcount:number, success: boolean}>{
        let conn:PoolConnection;
        try {
            conn = await this.pool.getConnection();

            let result = await conn.query(sql,args);

            if (result.length > 0) {
                return {success: true, data: result, rowcount: result.length}
            } else {
                return {success: true, data: [], rowcount: 0}
            }

        } catch(err) {
            return {success: false, data: err, rowcount: 0}
        } finally {
            if (conn) await conn.release();
        }
    }

    async signUp(args:DiscordUser): Promise<ResponseObject>{
        let result = await this.Query(`
            INSERT INTO 
                user
                    (discord_id, username)
            VALUES
                (?, ?)
        `, [args.discordId, args.discordUsername]);
        if (result.success) {
            return {success: true}
        } else {
            return {success: false, error: "You can only sign up once"}
        }
    }

    async checkForAssets(args:DiscordUser): Promise<ResponseObject> {
        let result = await this.Query<{assets:number}>(`
            SELECT
                sum(amount) as assets
            FROM
                transaction_history
            WHERE
                discord_id = ?
        `,[args.discordId]);

        if (result.success) {
            if (result.rowcount > 0) {
                return {success: true, data: result.data}
            }
        } else {
            return {success: false, error: "Something when wrong"}
        }
    }

    async payoutBet(winner:DiscordUser, losers:Array<DiscordUserWithBet>): Promise<ResponseObject> {

        let winnerPrize = losers.map(u => {return u.bet}).reduce((a, b) => a + b, 0);
        let entries = `(${winner.discordId}, ${winnerPrize}),`;

        losers.map((u) => {
            entries += `(${u.discordId}, ${-u.bet}),`;
        })

        let res = await this.Query(`
            INSERT INTO
                transaction_history
                    (discord_id, amount),
            VALUES
                ?
        `, [entries]);

        if(res.success) {
            return {success: true}
        } else {
            return {success: false}
        }

    }

    async sendTransaction(args:{DiscordUser, amount:number}): Promise<ResponseObject>{
        let result = await this.Query(`
            INSERT INTO 
                transaction_history
                    (discord_id, amount)
            VALUES
                (?,?)
        `, [args.DiscordUser, args.amount]);

        if (result.success) {
            return {success: true}
        } else {
            return {success: false, error: result.data[0] as string}
        }
    }

}
