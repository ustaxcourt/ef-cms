'use strict';

var tar = require('tar'),
    zlib = require('zlib'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    ProgressBar = require('progress'),
    utils = require('./utils');

var download = function (downloadUrl, installPath, callback) {
    console.log("Started downloading Dynamodb-local. Process may take few minutes.");
    http.get(downloadUrl, function (response) {
            var len = parseInt(response.headers['content-length'], 10),
            bar = new ProgressBar('Downloading dynamodb-local [:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 40,
                total: len
            });

            if (200 != response.statusCode) {
                throw new Error('Error getting DynamoDb local latest tar.gz location ' + response.headers.location + ': ' + response.statusCode);
            }

            response
                .pipe(zlib.Unzip())
                .pipe(tar.Extract({
                    path: installPath
                }))
                .on('data', function (chunk) {
                    bar.tick(chunk.length);
                })
                .on('end', function () {
                    callback("\n Installation complete!");
                })
                .on('error', function (err) {
                    throw new Error("Error in downloading Dynamodb local " + err);
                });
            })
        .on('error', function (err) {
            throw new Error("Error in downloading Dynamodb local " + err);
        });
};

var install = function (config, callback) {
    var install_path = utils.absPath(config.setup.install_path),
        jar = config.setup.jar,
        download_url = config.setup.download_url;

    try {
        if (fs.existsSync(path.join(install_path, jar))) {
            callback("Dynamodb is already installed on path!");
        } else {
            utils.createDir(config.setup.install_path);
            download(download_url, install_path, callback);
        }
    } catch (e) {}
};
module.exports.install = install;
