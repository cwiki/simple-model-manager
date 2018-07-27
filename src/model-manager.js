const SimpleUUID = require('./simple-uuid')
const murmur = require('murmurhash')
const AssertionError = require('assert').AssertionError

class ModelManager {
    constructor(storage) {
        this.storage = storage
        this.registry = new Map()
    }

    /**
     * Adds new mappings to control how models validated and UUID are attached
     * @param {mapping} represents a model manager map
     */
    register(...mapping) {
        mapping.forEach(map => {
            if (typeof map.__table === 'undefined' || typeof map.__primary === 'undefined') {
                const message = "Tried to add mapping but failed to find both __mapping and __primary"
                throw new AssertionError({ message })
            }
            this.registry.set(map.__table, map)
        })
    }

    /**
     * converts args into model request.
     * Adds both UID and State stamps
     * @param {*} args 
     * @return {*}}
     */
    async get(...args) {
        if (!this.storage.get) return

        let source, key, meta, fields

        // is a UUID
        if (args.length === 1 || Array.isArray(args[1])) {
            if (Array.isArray(args[1])) {
                fields = args[1]
            }
            [source, key] = SimpleUUID.decode(args[0])
            try {
                meta = this.storage.get && await this.storage.get({ source, key, fields })
            } catch (err) {
                return err
            }
        }

        // is key based
        if (!isNaN(args[1])) {
            if (Array.isArray(args[2])) {
                fields = args[2]
            }
            [source, key] = args
            try {
                meta = this.storage.get && await this.storage.get({ source, key, fields })
            } catch (err) {
                return err
            }
        }

        // is meta based
        if (typeof args[1] === 'object' && !Array.isArray(args[1])) {
            source = args[0]
            meta = Object.assign({}, args[1])
        }

        if (typeof (meta) === 'object') {
            this._modelFieldFilter(source, meta)
            this.addNullKey(source, meta)
            this.addPropFields(source, meta)
            return meta
        } else {
            return null
        }
    }

    /**
     * Deletes models
     * @param {*} models 
     */
    async delete(...models) {
        if (!this.storage.delete) return
        
        this.storage.delete(...models.map(model => {
            let [source, id] = SimpleUUID.decode(model.__uuid)
            if (id) return { source, key: id }
        }))

        models.map(model => {
            model.id = null
            this.addPropFields(model)
        })
    }

    /**
     * Saves models by their UID else inserts the entries
     * Attempts to optimize the queries, by combining them into 
     * their respective source sets
     * @param {*} models
     */
    async save(...models) {
        if (!this.storage.save) return

        let finalArray = []
        let updates = new Map()

        // model validation
        models.forEach(model => {
            let [source, id] = SimpleUUID.decode(model.__uuid)
            this._modelFieldFilter(source, model)
            if (!id) id = null

            const state = this._getState(model)

            if (model.__state !== state) {
                if (!updates.get(source)) updates.set(source, [])
                updates.get(source).push({ source, id, model })
                // Updates state to the newest version
                model.__state = state
            }
        })

        updates.forEach((model) => {
            finalArray.push(this.storage.save(...model))
        })
    }

    /**
     * Removes unregistered fields from a model
     * @param {*} meta 
     */
    _modelFieldFilter(source, meta) {
        const map = this.registry.get(source)
        for (let ob in meta) {
            if (ob[0] !== '_' && map[ob] === undefined) {
                delete meta[ob]
            }
        }
    }

    /**
     * Uses the source value to create UUID and creates 
     * a state hash from all non hidden fields
     * Also adds a null key value
     * @param source 
     * @param meta 
     */
    addPropFields(source, meta) {
        if (typeof meta !== 'object') return
        meta.__uuid = this._getUUID(source, meta)
        meta.__state = this._getState(meta)
    }

    /**
     * Adds null primary key value when primary known
     * @param {*} source 
     * @param {*} meta 
     */
    addNullKey(source, meta) {
        const map = this.registry.get(source)
        if (map && !meta.hasOwnProperty(map.__primary)) {
            meta[map.__primary] = null
        }
    }

    _getUUID(source, meta) {
        const map = this.registry.get(source)
        if (meta.hasOwnProperty(map.__primary) && meta[map.__primary])
            return SimpleUUID.encode(source, meta[map.__primary])
        return SimpleUUID.encode(source)
    }

    _getState(meta) {
        let objClone = {}
        for (let ob in meta) {
            if (ob[0] !== '_') objClone[ob] = meta[ob]
        }
        return murmur.v3(JSON.stringify(objClone))
    }
}

module.exports = ModelManager