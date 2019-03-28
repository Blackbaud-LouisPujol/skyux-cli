/*jshint node: true*/
'use strict';

const fetch = require('node-fetch');

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

/**
 * ENTRY POINT
 */
module.exports = (args) => {
  let swaggerUrl = args._[1];
  fetchSwaggerJson(swaggerUrl)
    .then(swaggerJson => {
      let model = getSpecifiedDataModel(swaggerJson, args._[2]);
      console.log(model);
    });
};
