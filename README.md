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

const conn =  mysql.createConnection({host:'localhost', user: 'root', database: 'test'});

const interface = new MGM.Interface({conn, config})

// Lazy load object
let UUID = 'user.32'
let user32 = interface.get(UUID)
let UUID = 'user.32'
let user32 = interface.get(UUID)


// Inject Data, if no id saving object creates a new object
let user32 = interface.inject("user", {
    id: 32,
    name: "riley"
})

let user32 = interface.factory("user", {
    id: 32,
    name: "riley"
    // generates additional fields
})
```


## Testing
This project uses JEST `npm test`

## Step By Step Example
Start by including the project

### Model

## Authors
* **Cody Wikman** - <cwiki.tucson@gmail.com>

## License
Context Permissions is provided under the MIT [LICENSE](LICENSE)