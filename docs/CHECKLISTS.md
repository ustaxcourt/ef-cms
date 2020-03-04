# Developer Check Lists
This file contains various check lists that can help you out when developing on this project and doing things such as adding a new endpoint or creating a new stack.

### New Endpoint Creation Check List
Due to our code architecture, adding a new endpoint is an involved process.  The following can be used a checklist to make sure all the necessary files are created and updated when atttempting to create a new endpoint:

- [ ] creating a new `*Lambda.js` file in the `./web-api/src`
- [ ] creating a new `*Interactor.js` file in the `./shared/src/business`
- [ ] updating the necessary `*Handlers.js` file to invoke the `*Lambda.js` file
- [ ] updating the desired `serverless.yml` file to add the new function endpoint
- [ ] creating a `*Proxy.js` file for this new endpoint inside `./shared/src/proxied`
- [ ] updating the `./web-client/src/applicationContext.js` file and import the new proxy interactor
- [ ] updating the `./web-api/src/applicationContext.js` file and import the new interactor

### New Stack Check List
All of our endpoints are split into multiple AWS CloudFormation stacks and hosted behind a single domain with base path mapping records.  Sometimes the stacks will get too large and you will start running into AWS limits.  Often you need to split your existing stack into 2 smaller stacks.  This check list can be followed to ensure you don't forget any of the steps.

- [ ] create a new `*Handlers.js` file, your functions for your new `serverless-*.yml` must point to this handlers
- [ ] create a new `serverless-*.yml` file in the `./web-api` directory (copy an existing one and modify as needed)
  - [ ] change the service name to something unique
  - [ ] change the `customDomain.basePath` to be something unique
  - [ ] change `serverless-offline.port` to be a new unique port
  - [ ] update the `package.include` to use the new handlers file you cretaed
- [ ] update `./web-api/proxy.js` to include your new path and map it to your new port
- [ ] create a new `./web-api/run-serverless*.sh` script (chmod 755 or copy an existing script) and modify it to use the new `*Handlers.js` file
- [ ] update `./web-api/run-local.sh` to include your new serverless service
- [ ] update `package.json` to have a new build method `build:api:YOUR_NEW_STACK`
- [ ] update `.circleci/config.yml` to deploy the new stack to both `us-east-1` and `us-west-1`