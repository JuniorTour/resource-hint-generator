## resource-hint-generator [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/JuniorTour/resource-hint-generator/pulls)
`prefetch`, `preconnect`和`dns-prefetch`等资源优先级提示自动化生成工具。

> 配套讲解文章《1.4秒到0.4秒-2行代码让JS加载耗时减少67%》：https://juejin.cn/post/7274889579076108348

<p align="center">
  <a href="https://www.npmjs.com/package/resource-hint-generator" target="_blank">
    <img
    src="https://img.shields.io/npm/dt/resource-hint-generator"
    alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/resource-hint-generator" target="_blank">
    <img
    src="https://img.shields.io/github/size/JuniorTour/resource-hint-generator/test/file-config/dist/resource-hint.js"
    alt="Hint File Size">
  </a>
  <a href="https://www.npmjs.com/package/resource-hint-generator" target="_blank">
    <img
    src="https://img.shields.io/npm/v/resource-hint-generator.svg?sanitize=true"
    alt="Version">
  </a>
  <a href="https://github.com/JuniorTour/resource-hint-generator" target="_blank">
    <img
    src="https://img.shields.io/github/last-commit/JuniorTour/resource-hint-generator?sanitize=true"
    alt="LastCommit">
  </a>
  <a href="https://github.com/JuniorTour/resource-hint-generator/actions/workflows/main.yml" target="_blank">
    <img
    src="https://github.com/JuniorTour/resource-hint-generator/actions/workflows/main.yml/badge.svg"
    alt="CIStatus">
  </a>
</p>


## 特性
1. 自动遍历构建产物，生成注入脚本，运行后注入`prefetch`资源优先级提示`link`标签
2. 指定域名，生成注入脚本，运行后注入`preconnect`和`dns-prefetch`资源优先级提示`link`标签

## 演示：
## 在线运行DEMO：https://stackblitz.com/edit/github-ckfcpg?file=README.md,dist%2Fresource-hint.js
![fe295039-983b-45a6-91b3-67d9131a8316](https://github.com/JuniorTour/blog/assets/14243906/59b9515d-b179-4f90-a753-c95de06be7ab)

## 用法

### 0. 安装
``` shell
npm install resource-hint-generator --save-dev
```

### 1. 配置
``` js
module.exports = {
  distPath: `./dist`,
  includeFileTestFunc: (fileName) => {
    return /(a.*js)|(b.*css)|(first.*js)/g.test(fileName);
  },
  publicPath: 'https://config.com/static/', 
  preconnectDomains: ['https://config.com'],
};

```

### 2. 运行
#### 1. 在`package.json`中新增运行命令`generate-resource-hint`
#### 2. 并追加运行命令到构建命令（`build`）后

例如：
``` json
// package.json
"scripts": {
    "generate-resource-hint": "resource-hint-generator",
    "build": "cross-env NODE_ENV=production webpack && npm run generate-resource-hint",
}
```

## 选项

配置项 | 简介 | 类型 | 默认值
-- | -- | -- | --
distPath | 打包产物路径，也是生成的resource-hint.js输出路径 | String | `'./dist'`
includeFileTestFunc | 指定一个函数，返回布尔值表示，遍历`distPath`找到的的`fileName`，是否会被作为`<link rel="prefetch">`的`href`属性值 | Function | `(fileName: string) => false`
includeFileNames | 指定一个数组，数组中的字符串元素，会被作为`<link rel="prefetch">`的`href`属性值 | String[] | `[]`
projectRootPath | 项目根目录路径 | String | `''`
resourceHintFileName | 生成的注入脚本名称 | String | `'resource-hint.js'`
crossOriginValue | `<link>`标签`crossorigin`的属性值，默认值`undefined`表示无`crossorigin`属性 | String \| undefined | `undefined`
publicPath | 用于和`includeFileTestFunc`、`includeFileNames`匹配到的文件名，拼接出`<link rel="prefetch">`标签的`href`属性值 | String | `''`
preconnectDomains | 指定一个数组，数组中的每个字符串元素，都将产生2个`href`属性值为当前字符串的`<link rel="preconnect">`标签和`<link rel="dns-prefetch">`标签 | String[] | `[]`
configFileName | 本地配置文件名称 | String | `'resource-hint-generator-config.js'`

## 欢迎 Issue && PR
