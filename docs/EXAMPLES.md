# Code Examples

* ModelManager = supplies, updates and maintains the collection of models
* Models = intreact with data entities

### Models
When models are created they are given "state". If the state changes they append the changes
to a new property "change".

State changes have to pass validation to be changed. Once validation is passed all of the models can be commited.
The query is built 


`const mm = new ModelManager({dbc, schema})`
`mm.get('dXNlcg==.MzI=') : Model`
`mm.get({table, id}) : Model` # primary key lookup
`mm.instance(table, {meta}) : Model`

Models are _JUST_ json objects that interact with Model Manager.

The model manager, can retrieve objects and save them to the database.
But it's all up to the system to interact with them as standard objects until commit time
Once a object is commited it acts.



### DB Mapping
user_mapping.json
```json
{
  "__table": "User",
  "__primary": "id",
  "id": [Number, 11, true],
  "name": [String, 255, true],
  "email": [String, 255, false],
  "manager_id": [String, 255, false],
  "password": [String, 64, true],
}
```

### Model
User.js
```javascript
const map = require('./mappings/user_mapping.json')
module.exports = User
```

### Model Object
The model object will have some added fields.
These are the 
* uid - universal id
* state - hash used to watch for changes to the object
```json
{
  "__uid": "dXNlcg==.MzI=",
  "__state": 1880429403,
  "id": 32,
  "name": "Janice",
  "email": "jjanice@some-company.com",
  "manager_id": "dXNlcg==.MzI="
}
```


### Requesting Model Object
The Model manager should be initialized with a data source
```js
const mm = new ModelManager({ dbc })
// Register the model schemas
mm.register(User)
// get the model
const thisUser = mm.get("User", 32)
```

The *__uid* allows the Model Manager to keep track of the object source. and understand changes.  
How the Model Manager interacts with models is determined by the schema.

### Model Manager Efficency
`mm.get("dXNlcg==.MzI="[, [fields]])` // get by UID, limit to fields
`mm.get(table, pk[, [fields]])` // get by key, limit to fields
`mm.get(table, meta)` // create from meta
`mm.save(...Models)`
`mm.delete(...Models)`

### Modifying and saving changes
Simple changes
```js
const user = mm.get("User", 32)
user.email = "jjanice@some-company.jp"
mm.save(user) // that's it
```

### Creating a new instance
```js
const user = mm.get("User")
{
  __uid: "dXNlcg==",
  "__state": 14123429403
}
```

### Saving incomplete objects
```js
const user = mm.get("User")
mm.save(user) // !Error name & password required
```
If user object is from a lookup, fields are no longer required (they should already exist)

### Primary key's are not allowed to change
```js
const user = mm.get("User", 32)
user.id = 44
mm.save(user) // !Error order primary key changed
```
This constriant is locked in by the UID  
When saving objects for the first time the UID field is populated