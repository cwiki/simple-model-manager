const SourceInterface = require('./source-interface')

class FactoryAdapter extends SourceInterface {

    constructor(datastore) {
        super(datastore)
    }

    get(...args) {
    }

    save(...models) {
    }

    delete(...models) {
    }
}


module.exports = FactoryAdapter