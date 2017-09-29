'use strict';

// 初始化环境
const Fs = require('fs');
const Path = require('path');
const Images = require('./package/images');
var Promise = require('bluebird');
Promise.promisifyAll(Fs);

// 导入配置
var configs = require('./config.json');

for (var i = 0; i < configs.length; i++) {
  go(configs[i]);
}

function processDir(dir) {
  return new Promise(function(resolve) {
    var imagesData = {
      count: 0,
      files: [],
      dir: dir
    };
    Fs.readdirAsync(dir)
      .map(function(file) {
        Fs.statAsync(dir + '/' + file)
          .then(function(stat) {
            if (stat.isDirectory()) {

            } else {
              imagesData.files[imagesData.count] = file
              imagesData.count++;
              resolve(imagesData);
            }
          })
      });

  });

}

function go(_config) {
  _config.path = Path.normalize(Path.resolve(_config.path) + '/');

  console.log('');
  console.log('***** config *****');
  console.log(_config);
  console.log('');
  //读取文件存储数组
  var imagesName = [];
  //获取当前目录绝对路径，这里resolve()不传入参数
  var filePath = _config.path; //path.resolve();
  //读取文件目录
  Fs.readdir(filePath, function(err, files) {
    if (err) {
      console.log(err);
      return;
    }
    var count = files.length;
    //console.log(files);
    var results = {};
    files.forEach(function(filename) {
      if (filename.match(/png|jpg/) && filename != _config.result)
        imagesName.push(filename);
    });
  });

  console.log('***** running *****');
  processDir(_config.path).then(function(imagesData) {

    var imgValues = [];
    for (let imgy = 0; imgy < _config.row; imgy++) {
      let imageValueyy = imgy * _config.height
      for (let imgx = 0; imgx < _config.col; imgx++) {
        let imageValuexx = imgx * _config.width
        let imageValue = {
          imgValueX: imageValuexx,
          imgValueY: imageValueyy,
        }
        imgValues.push(imageValue)
      }
    }

    var newImage = Images(_config.col * _config.width, _config.row * _config.height);

    var i = 0;
    var ss = setInterval(function() {
      var uri = imagesData.dir + imagesName[i];
      console.log(uri);
      if (!imgValues[i] || i === imagesName.length - 1) { //结束
        clearInterval(ss);
        newImage.save(imagesData.dir + _config.result, {
          quality: 50
        });
        console.log('');
        console.log('***** complete *****');
        console.log(imagesData.dir + _config.result);
        console.log('');
        return;
      }
      newImage.draw(Images(uri), imgValues[i].imgValueX, imgValues[i].imgValueY);
      i++;
    }, 100);

    return;
  });
}