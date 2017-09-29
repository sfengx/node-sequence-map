'use strict';

var ENV = 'DEV';
const images = require('images');

var Promise = require("bluebird");
Promise.promisifyAll(require("fs"));
Promise.promisifyAll(require("child_process"));

var fs = require("fs");
var path = require('path');

var _config = {
  width: 750,
  height: 1206,
  row: 4,
  col: 8,
  result: 'result.png',
  path: 'F:\\demo\\sprite\\a1\\'
}

go(_config);

function processDir1(dir) {
  return new Promise(function(resolve) {
    var imagesData = {
      count: 0,
      files: [],
      dir: dir
    };
    fs.readdirAsync(dir)
      .map(function(file) {
        fs.statAsync(dir + '/' + file)
          .then(function(stat) {
            if (stat.isDirectory()) {

            } else {
              imagesData.files[imagesData.count] = file
              imagesData.count++;
              // console.log(file);
              // console.log('22222222222')
              resolve(imagesData);
            }
          })
      });

  });

}

function go(_config) {
  //读取文件存储数组
  var imagesName = [];
  //获取当前目录绝对路径，这里resolve()不传入参数
  var filePath = _config.path; //path.resolve();
  //读取文件目录
  fs.readdir(filePath, function(err, files) {
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
  processDir1(_config.path).then(function(imagesData) {

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

    var newImage = images(_config.col * _config.width, _config.row * _config.height);

    var i = 0;
    var ss = setInterval(function() {
      var uri = imagesData.dir + imagesName[i];
      console.log(uri);
      if (!imgValues[i]) { //结束
        clearInterval(ss);
        newImage.save(imagesData.dir + _config.result, {
          quality: 50
        });
        console.log(imagesData.dir + _config.result);
        return;
      }
      newImage.draw(images(uri), imgValues[i].imgValueX, imgValues[i].imgValueY);
      if (i == imagesName.length - 1) { //结束
        clearInterval(ss);
        newImage.save(imagesData.dir + _config.result, {
          quality: 50
        });
        console.log(imagesData.dir + _config.result);
      }
      i++;
    }, 100);

    return;
  });
}