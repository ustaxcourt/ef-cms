dynamodb-localhost
=================================
[![Join the chat at https://gitter.im/99xt/dynamodb-localhost](https://badges.gitter.im/99xt/dynamodb-localhost.svg)](https://gitter.im/99xt/dynamodb-localhost?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/dynamodb-localhost.svg)](https://badge.fury.io/js/dynamodb-localhost)
[![license](https://img.shields.io/npm/l/dynamodb-localhost.svg)](https://www.npmjs.com/package/dynamodb-localhost)

This library works as a wrapper for AWS DynamoDB Local, intended for use in devops. This library is capable of downloading and installing the DynamoDB Local with a simple set of commands, and pass optional attributes defined in ['DynamoDB Local Documentation'](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).

## This Plugin Requires

* Java Runtime Engine (JRE) version 6.x or newer

## Features

* Method to Download/Install DynamoDB Local
* Remove/Uninstall DynamoDB Local
* Start/Restart DynamoDB Local with all the options givne in http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
* Stop individual instances of DynamoDb Local running

## Installation

`npm install --save dynamodb-localhost`

## Usage

Usage example

```
var dynamodbLocal = require("dynamodb-localhost");
dynamodbLocal.install(); /* This is one time operation. Safe to execute multiple times which installs DynamoDB once. All the other methods depends on this. */
dynamodbLocal.start({port: 8000});
```

Supported methods

```
install(callback)   To install DynamoDB Local for usage (This is one time operation unless execute remove). 'callback' function is called after installation completes (or if already installed, immediately)
start(options)      To start an instance of DynamoDB Local. More information about options shown in the coming section
stop(port)          To stop particular instance of DynamoDb Local running on an specified port
remove(callback)    To remove DynamoDB Local instance. 'callback' function is called after removal complete.
```

NOTE: After executing start(options), DynamoDB will process incoming requests until you stop it. To stop DynamoDB, type Ctrl+C in the command prompt window. To view dynamodb interactive web shell, go to DynamoDB Local [shell](http://localhost:8000/shell) in your browser.

All options for DynamoDB start:

```
{ port : 8000, /* Port to listen on. Default: 8000 */
  cors : '*', /* Enable CORS support (cross-origin resource sharing) for JavaScript. You must provide a comma-separated "allow" list of specific domains. The default setting for cors is an asterisk (*), which allows public access. */
  inMemory : true, /* DynamoDB; will run in memory, instead of using a database file. When you stop DynamoDB;, none of the data will be saved. Note that you cannot specify both dbPath and inMemory at once. */
  dbPath : '<mypath>/', /* The directory where DynamoDB will write its database file. If you do not specify this option, the file will be written to the current directory. Note that you cannot specify both dbPath and inMemory at once. For the path, current working directory is <projectroot>/node_modules/dynamodb-localhost/dynamob. For example to create <projectroot>/node_modules/dynamodb-localhost/dynamob/<mypath> you should specify '<mypath>/' with a forwardslash at the end. */
  sharedDb : true, /* DynamoDB will use a single database file, instead of using separate files for each credential and region. If you specify sharedDb, all DynamoDB clients will interact with the same set of tables regardless of their region and credential configuration. */
  delayTransientStatuses : true, /* Causes DynamoDB to introduce delays for certain operations. DynamoDB can perform some tasks almost instantaneously, such as create/update/delete operations on tables and indexes; however, the actual DynamoDB service requires more time for these tasks. Setting this parameter helps DynamoDB simulate the behavior of the Amazon DynamoDB web service more closely. (Currently, this parameter introduces delays only for global secondary indexes that are in either CREATING or DELETING status.) */
  optimizeDbBeforeStartup : true } /* Optimizes the underlying database tables before starting up DynamoDB on your computer. You must also specify -dbPath when you use this parameter. */
```

## Links

* [Dynamodb local documentation](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
* [Contact Us](mailto:ashanf@99x.lk)
* [NPM Registry](https://www.npmjs.com/package/dynamodb-localhost)

## Contributing

We love our contributors! If you'd like to contribute to the project, feel free to submit a PR. But please keep in mind the following guidelines:

* Propose your changes before you start working on a PR. You can reach us by submitting a Github issue. This is just to make sure that no one else is working on the same change, and to figure out the best way to solve the issue.
* If you're out of ideas, but still want to contribute, help us in solving Github issues already verified.
* Contributions are not just PRs! We'd be grateful for having you, and if you could provide some support for new comers, that be great! You can also do that by answering this plugin related questions on Stackoverflow.
You can also contribute by writing. Feel free to let us know if you want to publish a useful guides, improve the documentation (attributed to you, thank you!) that you feel will help the community.

## Credits

Bunch of thanks to doapp-ryanp who started [dynamodb-local](https://github.com/doapp-ryanp/dynamodb-local) project