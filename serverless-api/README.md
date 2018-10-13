# Prerequisites

`npm install -g serverless`

Install [terraform](https://www.terraform.io/intro/getting-started/install.html)

`npm run install`

`cd src && npm run install`

# Development Workflow

### Starting Serverless Offline

`npm start`

^ this will host a local service at http://localhost:3000

### Running Unit Test Coverage on a Watcher

`npm run test:coverage:watch`

### Running the Full Build (What Jenkins will Run)

`npm run build`

## Sandbox Deploys to AWS

`ENVIRONMENT=<yourname> ./deploy-Sandbox.sh`

Modify the API_URL in web-client/environments/dev.js to match the URL returned from the serverless deploy.