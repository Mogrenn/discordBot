const mariadb = require('mariadb');

class DataBaseAccess {
    private pool:any;
    constructor(hostname = "localhost", username = "root", password = "", database = "discord") {
        this.pool = mariadb.createPool({host: hostname, user: username, password: password, database: database});
    }

    async Query(sql, args) {
        let conn;
        try {
            conn = await this.pool.getConnection();

            //TODO: Fix the last things here
        } catch(err) {
            throw err;
        } finally {
            if (conn) await conn.release();
        }
    }

}