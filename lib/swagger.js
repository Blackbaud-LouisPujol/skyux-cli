/*jshint node: true*/
'use strict';

function doShit(args) {
  console.log(args);
}

/**
 * ENTRY POINT
 */
module.exports = (args) => {
  doShit(args);
};
