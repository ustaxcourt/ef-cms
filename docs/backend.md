# Backend

The backend of our project consists of a REST api used by the private UI, public UI, and various AWS Lambda functions for processing data.  This document is written to help outline the backend architecture and how it is used.

## Project Structure

Before diving into the technical aspects of the backend, it might be useful just to give an overview of the web api project structure.  The following tree structure is a pruned down version of our web-api directory with comments quickly explaining the purpose of each directory or file.  Some files and directories have been omitted for brevity, but these are some of the most important:

```
.
├── elasticsearch // scripts for setting up the elasticsearch cluster
│   ├── elasticsearch-indexes.js // all of the indices on the cluster
│   ├── elasticsearch-settings.js // the main settings
│   └── ... // other scripts
├── performance-testing
│   └── find-judge.js
├── runtimes // used to build up the lambda layers
│   └── puppeteer // puppeteer layer used for generating coversheets
│       ├── Dockerfile
│       ├── build.sh
│       ├── package-lock.json
│       └── package.json
├── src
│   ├── app-local.ts // used for running the backend locally
│   ├── app-public.js // the public API which contains all the endpoints
│   ├── app.js // the private API which contains all the endpoints
│   ├── applicationContext.js // the application context
│   ├── fallbackHandler.js // used for fallback to a different dynamo region is one if down
│   ├── genericHandler.js // used to wrap our lambda functions and return the proper format for AWS
│   ├── createLogger.js // used to create the logger
│   ├── lambdaWrapper.js // wraps all the lambda functions to be used in AWS
│   ├── logger.js // the logger we use
│   ├── auth // cookie related endpoints
│   ├── health // health check endpoints
│   ├── middleware // any middleware used in our application
│   ├── utilities
│   │   ├── cookieFormatting.js
│   ├── v1 // used for IRS API
│   │   ├── getCaseLambda.js
│   │   ├── getDocumentDownloadUrlLambda.js
│   │   ├── marshallers
│   │   ├── v1ApiWrapper.js
│   ├── v2 // used for IRS API
│   │   ├── getCaseLambda.js
│   │   ├── getDocumentDownloadUrlLambda.js
│   │   ├── getReconciliationReportLambda.js
│   │   ├── marshallers
│   │   ├── v2ApiWrapper.js
│   └── ... // other lambda folders and files
├── storage
│   ├── fixtures
│   │   ├── s3 // where local s3 files are stored
│   │   ├── seed // where the seed data is stored
│   ├── s3 // where s3rver hosts the files
│   └── scripts // random scripts for load testing locally
├── terraform
│   ├── api // a module for setting up the api for the backend
│   ├── bin
│   │   ├── deploy-app.sh // used for deplyoing the migration infrastructure
│   │   ├── is-migration-needed.ts // determines if a migration is needed
│   │   ├── track-successful-migrations.ts // tracks which migration scripts have run after doing a migration
│   ├── main
│   │   ├── main.tf // the main terraform entrypoint
│   └── template
│       ├── main.tf // the main terraform entrypoint for the template
├── workflow-terraform
│   ├── migration
│   │   ├── bin
│   │   │   ├── deploy-app.sh // used for deploying the migration code
│   │   └── main
│   │       ├── lambdas // the lambda containing the node logic
│   │       ├── main.tf  // the main terraform entrypoint
│   ├── migration-cron
│   │   ├── bin
│   │   │   ├── deploy-app.sh // used for deploying the cron lambda
│   │   │   └──  main
│   │   │       ├── lambdas // the lambda containing the node logic
│   │   │       ├── main.tf // the main terraform entrypoint
│   ├── reindex-cron
│   │   ├── bin
│   │   │   ├── deploy-app.sh // used for deploying the cron lambda
│   │   │   └──  main
│   │   │       ├── lambdas // the lambda containing the node logic
│   │   │       ├── main.tf // the main terraform entrypoint
│   ├── switch-colors-cron
│   │   ├── bin
│   │   │   ├── deploy-app.sh // used for deploying the cron lambda
│   │   │   └──  main
│   │   │       ├── lambdas // the lambda containing the node logic
│   │   │       ├── main.tf // the main terraform entrypoint
├── swagger.json // the swagger .json we update when api endpoints are changed or added
├── track-successful-migrations.js // tracks which migration scripts have run after doing a migration
├── verify-ses-email.sh // used to verify SES 
```

## Express

Our api is written using the [express](https://www.npmjs.com/package/express) library.  Express is a minimal web api framework for node.js.  It is used to create a REST api for our application.  The following is a quick overview of the express api.

```javascript
const express = require('express');
const app = express();

// you can register new endpoints using app.get, app.post, etc.

// register a new endpoint that accepts a GET request to /hello and returns hello world
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(8080);
```

In our application, we name all of our functions that process the endpoints as *Lambda.js.  For example, we have a file called `web-api/src/cases/addConsolidatedCaseLambda.js` which is registered in express like so:

```javascript
// app.js
app.put(
  '/case-meta/:docketNumber/consolidate-case',
  lambdaWrapper(addConsolidatedCaseLambda),
);
```

This will register our lambda with the endpoint provided.  Note, we also wrap all of our lambda functions with a higher order function which wraps some additional logic around the inputs and outputs of the lambda and also adds console logging.


## Serverless Express

## S3

## Elasticsearch


### Querying Elasticsearch locally

To query elasticsearch locally, run this docker container

```sh
docker run -p 3030:3030 -d appbaseio/mirage
```

- Open your browser to http://localhost:3030

- Update your `.elasticsearch/config/elasticsearch.yml` to have the following pasted at the bottom:

  ```yml
  http.port: 9200
  http.cors.allow-origin: "/.*/"
  http.cors.enabled: true
  http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
  http.cors.allow-credentials: true
  ```


## DynamoDB

### DynamoDB Access Patterns

Architecting a system with dynamodb can be tricky.  One recommendation from AWS is to create an access pattern table to help you understand the business use cases and how you plan to query that data via your PK, SK, or any GSI.  Here is a table docs/dynamodb-access-patterns.csv

