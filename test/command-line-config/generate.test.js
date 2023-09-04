const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function removeFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log(`removeFile ERROR: ${err}`)
  }
}

function getFileContent(filePath) {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
}

const resourceHintFileName = 'resource-hint.js'
const resourceHintJSFilePath = `./dist/${resourceHintFileName}`
const curAbsPath = __dirname

describe('Basic resource hint generator', () => {
  beforeEach(() => {
    return removeFile(resourceHintJSFilePath);
  });

  test('should generate prefetch resource hint', async () => {
    const command = `node ./src/bin.js --projectRootPath ${curAbsPath} --includeFileNames a.js,b.css,first.js,second.js`
    console.log(`command=${command}`)
    // TODO 考虑加上调用函数的测试用例，以便于debug
    
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      console.error(`stderr:\n${stderr}`)
    }
    console.log(`stdout:\n${stdout}`)
    
    const fileContent = getFileContent(resourceHintJSFilePath)
    expect(fileContent).toMatch(`'/a.js','/b.css','first/first.js','second/second.js',`)
    expect(fileContent).toMatch(`const CDN_HOST = '' || window.cdnPath;`)
    expect(fileContent).toMatch(`const crossOriginAttrVal = undefined || '';`)
  });
  
  test('should generate preconnect resource hint', async () => {
    const includeFiles = 'a.js'
    const publicPath = 'https://a.com/static/'
    const preconnectDomains = 'https://b.com'
    const command = `node ./src/bin.js --projectRootPath ${curAbsPath} --includeFileNames ${includeFiles} --publicPath ${publicPath} --preconnectDomains ${preconnectDomains} `
    console.log(`command=${command}`)
    // TODO 考虑加上调用函数的测试用例，以便于debug
    
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      console.error(`stderr:\n${stderr}`)
    }
    console.log(`stdout:\n${stdout}`)
    
    const fileContent = getFileContent(resourceHintJSFilePath)
    expect(fileContent).toMatch(`['/${includeFiles}',]`)
    expect(fileContent).toMatch(`const CDN_HOST = '${publicPath}' || window.cdnPath;`)
    expect(fileContent).toMatch(`['${preconnectDomains}',]`)
    expect(fileContent).toMatch(`const crossOriginAttrVal = undefined || '';`)
  });
});