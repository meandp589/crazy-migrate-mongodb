const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

ajv.addKeyword('functionType', {
    modifying: true,
    schema: false, // keywords value is not used, can be true
    validate: function(data, dataPath, parentData, parentDataProperty){
        return typeof parentData[parentDataProperty] == 'function'
    }
});

ajv.addKeyword('emptyChecker', {
    modifying: true,
    schema: false, // keywords value is not used, can be true
    validate: function(data, dataPath, parentData, parentDataProperty){
      return parentData[parentDataProperty]
    }
  });

exports.validateMongodbUrl = body => {
    let schema = {
      type: "object",
      required:  ['url', 'databaseName'],
      additionalProperties: false,
      properties: {
            url: { 
                type: "string",
                pattern: 'mongodb:\/\/(.+):[0-9]*$'
            },
            databaseName: { 
                type: "string",
                emptyChecker: true
            },
            options: {
                type: "object"
            }
        }
    };
    let validateBody = ajv.validate(schema, body);
    if (!validateBody) {
      let validateError = ajv.errorsText();
      return validateError;
    }
};

exports.validateFunction = body => {
    let schema = {
      type: "object",
      required:  ['schemaVersion', 'up', 'down'],
      additionalProperties: false,
      properties: {
            schemaVersion: { 
                type: "number",
                emptyChecker: true
            },
            up: {
                functionType: true
            },
            down: {
                functionType: true
            }
        }
    };
    let validateBody = ajv.validate(schema, body);
    if (!validateBody) {
      let validateError = ajv.errorsText();
      return validateError;
    }
};

exports.validateMigrateDB = body => {
    let schema = {
      type: "object",
      required:  ['collectionName','schemaVersion'],
      additionalProperties: false,
      properties: {
            collectionName: { 
                type: "string",
                emptyChecker: true
            },
            schemaVersion: { 
                type: "number",
                emptyChecker: true
            },
            enable: {
                type: 'boolean'
            }
        }
    };
    let validateBody = ajv.validate(schema, body);
    if (!validateBody) {
      let validateError = ajv.errorsText();
      return validateError;
    }
};