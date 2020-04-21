# crazy-migrate-mongodb
A database migration tool for MongoDB in Node.js. 

## Installation
````bash
$ npm install crazy-migrate-mongodb --save
````

## Init with config (call once)
````bash
// Node.js require:
const crazyMigrate = require('crazy-migrate-mongodb')
crazyMigrate.init( { url: 'mongodb://127.0.0.1:27017' ,databaseName:'database-name', options: { useUnifiedTopology: true }  } )
````

## Getting started
````bash
// ...
crazyMigrate.migratedb({ collectionName: 'collection-name-1', schemaVersion: 2, enable: true  }).add({
    schemaVersion: 1,
    up: function(data) {
        firstName = data.firstName || ''
        lastName = data.lastName || ''
        if(data.firstName || data.lastName) {
            data.name = firstName + ' ' + lastName
        }
    },
    down: function(data) {
        delete data.firstName
        delete data.lastName
    }
}).add({
    schemaVersion: 2,
    up: function(data) {
        if(data.name) {
            let name = data.name.split(' ')
            data.firstName = name[0]
            data.lastName = name[1]
        }
    },
    down: function(data) {
        delete data.name
    }
})
// ...
````
