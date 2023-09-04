const { start } = require('./generate');
const { getOptions } = require('./options');

function run(injectOptions = {}) {
  getOptions(injectOptions);
  start();
}

module.exports = {
  run,
};
