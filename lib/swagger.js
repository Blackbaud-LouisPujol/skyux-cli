/*jshint node: true*/
'use strict';

const fetch = require('node-fetch');
let importUUID = false;

function fetchSwaggerJson(swaggerUrl) {
  return new Promise(resolve => {
    fetch(swaggerUrl)
      .then(data => {
        resolve(data.json());
      });
  });
}

function getSpecifiedDataModel(swaggerJson, modelName) {
  return swaggerJson.definitions[modelName];
}

function generatePropertyFromJson(propertyJson, propertyName) {
  let propertyString = '\t' + propertyName + ': ';
  if (propertyJson.format === 'uuid') {
    importUUID = true;
    propertyString = propertyString + 'UUID;';
  } else if (propertyJson.format === 'date-time') {
    propertyString = propertyString + 'Date;';
  } else if (propertyJson.type === 'integer') {
    propertyString = propertyString + 'number;';
  } else if (propertyJson.type === 'array') {
    propertyString = propertyString + '[];';
  } else if (propertyJson.type === 'object' || propertyJson.hasOwnProperty('$ref')) {
    propertyString = propertyString + 'any;';
  } else {
    propertyString = propertyString + propertyJson.type + ';';
  }

  return propertyString.concat('\n');
}

function generateInterface(model) {
  let interfaceText = 'export interface ' + model.title + ' {\n';
  for (let property in model.properties) {
    interfaceText = interfaceText + generatePropertyFromJson(model.properties[property], property);
  }

  if (importUUID) {
    interfaceText = 'import {\n\tUUID\n} from \'angular2-uuid\';\n\n' + interfaceText;
    console.log('imported angular2-uuid with interface. update `package.json` ' +
      'and run `npm install` after completion');
  }

  return interfaceText.concat('}\n');
}

/**
 * ENTRY POINT
 */
module.exports = (args) => {
  let swaggerUrl = args._[1];
  fetchSwaggerJson(swaggerUrl)
    .then(swaggerJson => {
      let model = getSpecifiedDataModel(swaggerJson, args._[2]);
      let interfaceText = generateInterface(model);
      console.log(interfaceText);
    });
};
