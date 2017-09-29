'use strict';

// 初始化环境
const _ = require('lodash');
const Fs = require('fs');
const Path = require('path');
const Images = require('../package/images');

// 导入配置
var configs = require('../config.json');

// 兼容json
if (!_.isArray(configs) && 　_.isObject(configs)) {
  configs = [configs]
}

for (var i = 0; i < configs.length; i++) {
  main(configs[i]);
}

/*
 * 主入口
 *
 */
function main(config) {
  config.path = Path.normalize(Path.resolve(config.path) + '/');

  let imageList = []; // 读取文件存储数组
  let map = []; // 图片坐标图
  let result; // 画板

  // 读取文件目录并筛选文件
  Fs.readdirSync(config.path).map(function(file) {

    if (file.match(/.png|.jp(e)g/) && file != config.result) { // 验证类型
      imageList.push(file);
    }

  });

  // 生成坐标
  let imgy;
  let imgx;
  let x;
  let y;
  for (imgy = 0; imgy < config.row; imgy++) {
    y = imgy * config.height
    for (imgx = 0; imgx < config.col; imgx++) {
      x = imgx * config.width
      map.push({
        x: x,
        y: y,
      })
    }
  }

  // 初始化画板
  result = Images(config.col * config.width, config.row * config.height);

  console.log('');
  console.log('***** config *****');
  console.log(config);
  console.log('');
  console.log('***** running *****');

  let i = 0;
  let ss;
  ss = setInterval(function() {
    let uri;
    uri = config.path + imageList[i];
    if (!map[i] || i === imageList.length - 1) { //结束
      clearInterval(ss);
      result.save(config.path + config.result, {
        quality: 50
      });
      console.log('');
      console.log('***** complete *****');
      console.log(config.path + config.result);
      console.log('');
      return;
    }
    console.log(uri);
    result.draw(Images(uri), map[i].x, map[i].y);
    i++;
  });
}