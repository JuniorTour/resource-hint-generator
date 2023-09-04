module.exports = {
  distPath: `./dist`, // 指定打包资源所在路径（相对于项目根目录）
  // 指定一个函数，返回布尔值值表示，
  // 在distPath文件夹中遍历到的文件名 fileName 是否需要 Prefetch
  includeFileTestFunc: (fileName) => {
    return /(a.*js)|(b.*css)|(first.*js)/g.test(fileName);
  },
  // 上述includeFileTestFunc等价于：
  // includeFileNames: [
  //   'a.js',
  //   'b.css',
  //   'first.js'
  // ],
  // Prefetch 资源的 CDN URL，最终会与文件名拼接为完整的 href 值
  publicPath: 'https://config.com/static/', 
  // 需要 preconnect 提示的域名
  preconnectDomains: ['https://config.com'],
  crossOriginValue: '',
};
