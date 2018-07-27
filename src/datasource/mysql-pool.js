
class MysqlPool {

    /**
     * Creates the conneciton pool
     * @param mysqlPool instance of mysql2/pool
     */
    constructor(mysqlPool) {
        this.cache = new Map()
        this.pool = mysqlPool
    }

    /**
     * Mocks the get functionality.
     * This always returns an object if valid source!
     * Usually you would get NULL if not exists
     * @param { source, key, fields } args 
     */
    get(target) {
        return this.pool.query('SELECT user_login FROM users WHERE user_id > ? LIMIT 2', [250])
        // return await Promise.all([
        //     pool.query('SELECT user_login FROM users WHERE user_id > ? LIMIT 2', [250]),
        //     pool.query('SELECT user_login FROM users WHERE user_id > ? LIMIT 2', [260])
        // ]).catch(err => { throw err })
    }

    save(...models) {
        models = [].concat(models)
        models.forEach(model => {

        })
    }

    delete(...models) {
        models = [].concat(models)
        models.forEach(model => {

        })
    }
}


module.exports = MysqlPool