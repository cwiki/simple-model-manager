# ModelManager

### Example Usage

Basic example of creating a new new model manager with a data source and mapping
```js
const { ModelManager } = require('./src')
const { DataSource } = requrie('./src/datasource') // this can be any data source object

const mapping = {
    __table: "order_detail",
    __primary: "id",
    id: [Number, 11, false],
    name: [String, 18, false]
}

// Create a new MM using a Factory
const mm = new ModelManager(DataSource)

// Each type of object needs a mapping to work properly
// you can now use order_detail based models
mm.register(mapping)

// retrieves order detail 1
let od1 = mm.get('order_detail', 1)
```

#### GET
You can use the get method on Model Manager in 3 ways
* source name and id, performs a lookup
* with a UUID, performs a lookup
* source name and seed data, creates a object from seed data

Model changes/filtering
* Fields are limited to registry listing
```js
const seedData = {
    id: 26658,
    order_id: 38123,
    date: '2017-10-03T16:17:56.141Z',
    line: 'voluptates laboriosam et'
}

let od1 = mm.get('order_detail', 1) // by id
let od1 = mm.get('b3JkZXJfZGV0YWls.MQ==') // by UUID
let od1 = mm.get('order_detail', seedData) // providing data

console.log(od1)
/*
{   __uuid: 'b3JkZXJfZGV0YWls.MQ==',
    __state: 543382660,
    id: 26658,
    order_id: 38123,
    date: 2017-10-03T16:17:56.141Z,
    line: 'voluptates laboriosam et' }
*/
```

#### SAVE
Model changes on save
* __uuid
* __state
* [registry.__primary] set to storage value
* removes UNKNOWN fields
* type converts NUMBERS / STRINGS respectively

Errors if missing required insert fields
```js 
mm.save(...models)
```

#### DELETE
Model changes on delete
* __uuid
* __state
* [registry.__primary] field set to null
```js 
mm.delete(...models)
```

#### Future
* target fields in object request (argument supported, not implimented)