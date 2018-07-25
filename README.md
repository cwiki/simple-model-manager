# Mysql Generated Models
A SQL first orm that emphesises simplicity and testing.  
Instead of managing the database MysqlGM attempts to examine the database and create base models to use with 
your existing data. Instead of writing how these objects are going to talk to eachother a user gives the model MYSQL data.

### How it works

## Getting Started
Require the generated models interface
```js
const MGM = require('myslq-generated-models')
const mysql2 = require('mysql2/promise')

// has the database configuration
const config = {
    user: {
        config: {
            primary: "id", // signifis primary key, default is id
            private: ["password"], // doesn't get queried
            required: ["id", "name"] // fields that must exist on "NEW"
        },
        fields: {
            id: Number,
            name: String,
            password: String,
            address_id: Number
        }
    }
}

const conn =  mysql.createConnection({host:'localhost', user: 'root', database: 'test'})

const interface = new MGM.Interface({conn, config})

// Lazy load object
let user32 = interface.get('dXNlcg==.MzI=') // UID

// Inject Data
let user32 = interface.get({
    id: 32,
    name: "riley"
}, "user")
```
There is no ORM like searching in MysqlGM. Instead we prefer to use that the user perform a traditional MYSQL query 
then pass those results into a model interface.

Users can save interface models. `.save(), .delete()`

All objects belong to `MGM` and gives the user back a interface to it's data. 
MGM keeps track of object's states and change to best make updates and to allow for caching data.

`MGM.commit()` Changes are saved until the user decides to "COMMIT" the changes. Then the ORM does it's best to 
resolve the changes responsably

## Testing
This project uses JEST `npm test`

## Step By Step Example
Start by including the project

### Model

## Authors
* **Cody Wikman** - <cwiki.tucson@gmail.com>

## License
Context Permissions is provided under the MIT [LICENSE](LICENSE)