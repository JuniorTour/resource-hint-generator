const path = require('path');
const fs = require('fs');
const { getProjectRootPath } = require('./utils');

const defaultOptions = {
  distPath: `./dist`,
  projectRootPath: ``,
  resourceHintFileName: `resource-hint.js`,
  includeFileNames: [],
  crossOriginValue: undefined,
  publicPath: '',
  preconnectDomains: [],
  configFileName: 'resource-hint-generator-config.js',
  includeFileTestFunc: () => false,
  buildEnv: 'PROD'
};

let options = defaultOptions || {};

function getParam(paramsArr, key, defaultValue) {
  const index = paramsArr.indexOf(`--${key}`);
  let val = defaultValue;
  if (index >= 0) {
    val = paramsArr[index + 1];
  }
  if (defaultValue instanceof Array && val.split) {
    val = val.split(',');
  }
  return val;
}

function getOptionsFromCommandLine() {
  console.log(`getOptionsFromCommandLine process.argv=${process.argv}`);
  const params = process.argv.slice(2);
  // console.log(`getOptionsFromCommandLine params=${params}`);
  Object.keys(defaultOptions).forEach((key) => {
    options[key] = getParam(params, key, defaultOptions[key]);
  });

  console.log(`options=${JSON.stringify(options, null, 2)}`);
  return options;
}

function getOptionsFromConfigFile() {
  const configFilePath = path.resolve(
    getProjectRootPath(options.projectRootPath),
    './' + options.configFileName
  );
  console.log(`configFilePath=${configFilePath}`);
  let config = {};
  try {
    config = require(configFilePath);
    console.log(`config from file=${JSON.stringify(config, null, 2)}`);
  } catch (err) {
    console.error(`getOptionsFromConfigFile ERROR: ` + err);
  }
  Object.keys(config).forEach((key) => {
    options[key] = config[key];
  });
}

function getOptions(injectOptions) {
  Object.keys(injectOptions).forEach((key) => {
    options[key] = injectOptions[key];
  });
  getOptionsFromCommandLine();
  getOptionsFromConfigFile();
}

module.exports = {
  getOptions,
  options,
};
