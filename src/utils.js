const path = require('path');
const fs = require('fs');

function getProjectRootPath(projectRootPathFromOption) {
  console.log(`projectRootPathFromOption __dirname=${__dirname}`)
  return projectRootPathFromOption || path.resolve(__dirname).split('node_modules')?.[0];
}

function getRelativePath(dir) {
  return path.resolve(__dirname, dir);
}


function writeToFile(inputPath, outputPath, replacements) {
  try {
    let content = fs.readFileSync(inputPath, 'utf8');
    if (!content) {
      return;
    }
    const replacementKeys = Object.keys(replacements);
    if (replacementKeys?.length) {
      replacementKeys.forEach((key) => {
        content = content.replace(key, replacements[key]);
      });
    }
    fs.writeFileSync(outputPath, content, 'utf8');
  } catch (err) {
    console.log(`[generate-prefetch-script.js] writeToFile() ERROR:${err}`);
  }
}

module.exports = {
  getProjectRootPath,
  getRelativePath,
  writeToFile,
}