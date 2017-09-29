const Fs = require('fs');
/*
 * 遍历目录
 *
 */
function processDir(dir) {
  return new Promise(function(resolve) {
    let imagesData = {
      count: 0,
      files: [],
      dir: dir
    };
    Fs.readdirAsync(dir)
      .map(function(file) {
        if (true) {// 验证类型

        }
        Fs.statAsync(dir + '/' + file)
          .then(function(stat) {
            // console.log(file, stat.isDirectory());
            if (!stat.isDirectory()) { // 文件
              imagesData.files[imagesData.count] = file
              imagesData.count++;
              // return resolve(imagesData);
            }
          })
      });
    return resolve(imagesData);
  });
}

module.exports = {processDir}
