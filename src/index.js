const _mongodb = require('mongodb')
const validate = require('./services/validate')
const MongoClient = _mongodb.MongoClient
let mConnect = null
 
module.exports.init = (mongoConfig) => {
    mongodb = mongoConfig
    let validateUrl = validate.validateMongodbUrl(mongodb)
    if(validateUrl) {
        throw Error(validateUrl)
    }
    mConnect = mongoConnect(mongodb)
}

module.exports.migationdb = ({ collectionName, schemaVersion, enable = true }) => {
    let isMigrated = false
    let isArrived = false
    let validateMigationDb = validate.validateMigationDb({collectionName, schemaVersion})
    if(validateMigationDb) {
        throw Error(validateMigationDb)
    }
    return {
        add: function(migration) {
            if(!enable && !isArrived) {
                console.log("Migration Disable")
                isArrived = true
                return this
            }
            let validateFunction = validate.validateFunction(migration)
            if(validateFunction) {
                throw Error(validateFunction)
            }
            if(migration.schemaVersion == schemaVersion) {
                if(isMigrated) {
                    return this
                }
                isMigrated = true
                mConnect.then(({ db, mClient }) => {
                    const collection = db.collection(collectionName)
                    collection.find().forEach(result => {
                        migration.up(result);
                        return db.collection(collectionName).updateOne({_id: new _mongodb.ObjectID(result._id)}, { $set: result })
                    })
                    return db
                }).then((db) => {
                    const collection = db.collection(collectionName)
                    let unset = {}
                    return collection.find().forEach(result => {
                        let oldData = {...result}
                        migration.down(result)
                        let downData = {...result}
                        if(Object.keys(unset).length == 0) {
                            for (const data of Object.keys(oldData)) {
                                if (!downData.hasOwnProperty(data)) {
                                    unset = { ...unset ,[data]: 1 }
                                }
                            }
                        }
                        if(Object.keys(unset).length == 0) {
                            return null
                        }
                        return db.collection(collectionName).updateOne({_id: new _mongodb.ObjectID(result._id)}, { $unset: unset })
                    })
                }).then(() => {
                    console.log(`Migration ${collectionName} Success...`)
                }).catch(error => { 
                    throw Error(error) 
                })
            }
            
            isArrived = true
            return this
        }
    };
}

function mongoConnect(mongodb) {
    let { url, databaseName, options } = mongodb
    return MongoClient.connect(url, options).then(client => {
        mClient = client
        return { db: client.db(databaseName), mClient: client }
    })
}

