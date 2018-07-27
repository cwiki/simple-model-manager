
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
    async get(args) {
        let queryString = `SELECT ?? FROM ?? WHERE user_id = ?`
        const [data, fields] = await this.pool.query(queryString, [args.fields, args.source, [args.key]])
            .catch(console.error)
        return data
    }

    save(...models) {
        models = [].concat(models)
        models.forEach(model => {
            let queryString = `INSERT INTO ?? VALUES ??`
            const [data, fields] = await this.pool.query(queryString, [args.source, [args.key]])
                .catch(console.error)
            return data
        })
    }

    delete(...models) {
        models = [].concat(models)
        models.forEach(model => {

        })
    }
}


module.exports = MysqlPool