'use strict';

var installer = require('./dynamodb/installer'),
    starter = require('./dynamodb/starter'),
    utils = require('./dynamodb/utils'),
    config = require('./dynamodb/config.json'),
    dbInstances = {};

var dynamodb = {
    install: function(callback, path) {
        if (path) {
            config.setup.install_path = path;
        }
        installer.install(config, function(msg) {
            console.log(msg);
            callback();
        });
    },
    start: function(options) {
        var instance = starter.start(options, config);
        dbInstances[instance.port] = {
            process: instance.proc,
            options: options
        };
        instance.proc.on('close', function(code) {
            if (code !== null && code !== 0) {
                console.log('DynamoDB Local failed to start with code', code);
            }
        });
        console.log('Dynamodb Local Started, Visit: http://localhost:' + (options.port || config.start.port) + '/shell');
    },
    stop: function(port) {
        if (dbInstances[port]) {
            dbInstances[port].process.kill('SIGKILL');
            delete dbInstances[port];
        }
    },
    restart: function(port) {
        var options = dbInstances[port].options;
        this.stop(port);
        this.start(options);
        console.log("Successfully restarted dynamodb local on port: " + port);
    },
    remove: function(callback) {
        utils.removeDir(config.setup.install_path, function() {
            console.log("Successfully removed dynamodb local!");
            callback();
        });
    }
};
module.exports = dynamodb;
