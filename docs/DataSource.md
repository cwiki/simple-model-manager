# DataSource
Essential tool for using the model manager data sources may very and be extended.

You can use custom sources as long as they pretain to these requirements
```js
class ExampleSource {
    /**
     * sourceName, id[, fields]
     * UUID[, fields]
     * sourceName, SeedData
     * @param {key, source, fields} args
     * if fields are supplied for id or uuid lookups, they should only lookup the respective fields
     * @return object
    */
    get(...args){
        // get attempts to resolve the argments and returns a model object
    }

    /**
     * @param {key, source, model} models
    */
    save(...models){
        // models passed in well share a source so they can be done in batches
    }
    
    /**
     * Accepts models. Each are saved to their respective resource
     * @param {key, source, model} models
    */
    delete(...models){
        // models passed in well share a source so they can be done in batches
    }
}
```