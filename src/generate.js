/* eslint-env node */
const path = require('path');
const fs = require('fs-extra'); // TODO 改用原生fs
const { options } = require('./options');
const { getProjectRootPath, getRelativePath, writeToFile } = require('./utils');

function getFiles(dir, relativePath = '') {
  let data = [];
  let filesAndDirs;
  try {
    filesAndDirs = fs.readdirSync(path.resolve(__dirname, dir), {
      withFileTypes: true,
    });
  } catch (err) {
    console.log(`[resource-hint-generator] getFiles() ERROR:${err}`);
  }
  filesAndDirs?.forEach((item) => {
    const name = item.name;
    const allRelativePath = relativePath + '/' + name;
    if (item?.isDirectory()) {
      data = data.concat(getFiles(`${dir}/${name}`, name));
    } else if (
      options.includeFileNames.includes(name) ||
      options.includeFileTestFunc?.(name)
    ) {
      data.push(allRelativePath);
      console.log(`  Include files path: ${allRelativePath}`);
    }
  });

  return data;
}

function getAssetFiles(dirs) {
  if (!dirs?.length) {
    return;
  }
  let allFiles = [];
  dirs.forEach((dir) => {
    allFiles = allFiles.concat(getFiles(dir));
  });
  return allFiles;
}

function getDataStrFromArray(arr) {
  return arr.reduce((acc, cur) => acc + `'${cur}',`, '');
}

function start() {
  let outputFileName, outputFilePath;
  const distPath = options.distPath;
  console.log(`[resource-hint-generator] distPath=${distPath}`);
  const distDirPath = path.resolve(
    getProjectRootPath(options.projectRootPath),
    distPath
  );
  console.log(`distDirPath=${distDirPath}`);

  const assetFiles = getAssetFiles([distDirPath]);
  const prefetchFilesDataStr = getDataStrFromArray(assetFiles);
  // console.log(`prefetchFilesDataStr=${prefetchFilesDataStr}`);

  const domainsDataStr = getDataStrFromArray(options.preconnectDomains);
  // console.log(`domainsDataStr=${domainsDataStr}`);

  const resourceHintFileName = options.resourceHintFileName;

  if(options.buildEnv === 'PROD'){ // default build in PROD env
    outputFileName = `${resourceHintFileName}`;
    outputFilePath = `${distDirPath}/${outputFileName}`;
  }else{ // other build env: DEV or TEST, add '-dev' or '-test' for output file name
    const fileNameArr = resourceHintFileName.split("."); // [name, type]
    const fileName = fileNameArr.slice(0, fileNameArr.length - 1);
    const fileType = fileNameArr[fileNameArr.length - 1];

    outputFileName = `${fileName}-${options.buildEnv.toLowerCase()}`;
    outputFilePath = `${distDirPath}/${outputFileName}.${fileType}`;
  }

  console.log(`outputFilePath=${outputFilePath}`);
  // Fixme 考虑随项目编译resourceHintFileName，是不是就得考虑Webpack Plugin形式了？
  debugger;
  writeToFile(getRelativePath('./resource-hint.template.js'), outputFilePath, {
    __PREFETCH_SRC_DATA_PLACEHOLDER__: prefetchFilesDataStr,
    __CROSS_ORIGIN_VALUE_PLACEHOLDER__:
      typeof options.crossOriginValue === 'string'
        ? `'${options.crossOriginValue}'`
        : options.crossOriginValue,
    __PUBLIC_PATH_PLACEHOLDER__: `'${options.publicPath}'`,
    __PRECONNECT_DATA_PLACEHOLDER__: domainsDataStr,
  });
}

module.exports = {
  start,
};
