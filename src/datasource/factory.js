const dataFactory = require('./../../examples/factory')


class Factory {

    constructor() {
        this.cache = new Map()
    }

    _makeKey(s, k) {
        return String(s) + String(k)
    }

    /**
     * Mocks the get functionality.
     * This always returns an object if valid source! 
     * Usually you would get NULL if not exists
     * @param { source, key, fields } args 
     */
    get(target) {
        let key, model
        if (!dataFactory[target.source]) {
            return model
        }

        // get from cache if exists
        if (!(target.source && target.key)) {
            return model
        }

        key = this._makeKey(target.source, target.key)
        if (this.cache.has(key)) {
            // retrieve model
            model = this.cache.get(key)
        } else {
            // generate model
            model = dataFactory[target.source](target.key)
            this.cache.set(this._makeKey(target.source, target.key || model.id), model)
        }

        // short circuit if no filtering
        if (!target.fields) {
            return model
        }

        // filter unwanted properties
        for (let prop in model) {
            if (!target.fields.includes(prop)) {
                delete model[prop]
            }
        }

        return model
    }

    save(...models) {
        models = [].concat(models)
        models.forEach(model => {
            this.cache.set(this._makeKey(model.source, model.key), model.model)
        })
    }

    delete(...models) {
        models = [].concat(models)
        models.forEach(model => {
            this.cache.delete(this._makeKey(model.source, model.key))
        })
    }
}


module.exports = Factory