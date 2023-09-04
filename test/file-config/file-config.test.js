const fs = require('fs');
const path = require('path');
const { run: generatorRunner } = require('../../src/index');
const config = require('./resource-hint-generator-config');

function removeFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`${filePath} removed`)
  } catch (err) {
    console.log(`removeFile ERROR: ${err}`);
  }
}

function getFileContent(filePath) {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
}

const resourceHintFileName = 'resource-hint.js';
const resourceHintJSFilePath = `./dist/${resourceHintFileName}`;
const curAbsPath = __dirname;

describe('Resource hint generator file config', () => {
  beforeEach(() => {
    return removeFile(path.resolve(__dirname, resourceHintJSFilePath));
  });

  test('should generate resource hint based on config file', async () => {
    generatorRunner({ projectRootPath: __dirname });

    const fileContent = getFileContent(resourceHintJSFilePath);
    const allFiles = config.includeFileNames || [
      'a.js',
      'b.css',
      'first.js'
    ]
    allFiles.forEach(name => {
      expect(fileContent).toMatch(name);
    })
    expect(fileContent).toMatch(
      `const CDN_HOST = '${config.publicPath}' || window.cdnPath;`
    );
    expect(fileContent).toMatch(`['${config.preconnectDomains}',]`);
    const crossOriginValue = typeof config.crossOriginValue === 'string'
    ? `'${config.crossOriginValue}'`
    : config.crossOriginValue
    expect(fileContent).toMatch(
      `const crossOriginAttrVal = ${crossOriginValue} || '';`
    );
  });
});
