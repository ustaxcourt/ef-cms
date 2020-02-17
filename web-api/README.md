# Electronic Filing / Case Management System APIs

## Prerequisites

- [install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- install Node dependencies: `npm install`

## Optional prerequisites, if setting up a local sandbox

- `npm install -g serverless`
- [Install Terraform](https://www.terraform.io/intro/getting-started/install.html)

### Starting Serverless-Offline

`npm start`

This will host a local service at http://localhost:3000.

### Running Unit Tests with Coverage

- `npm test`

# Troubleshooting

Sometimes you may get errors when running `npm install`.  To fix this, delete `package-lock.json` and re-run `npm install`.

## Sandbox Deploys to AWS

Run `EFCMS_DOMAIN=ustc-case-mgmt.example.gov ENVIRONMENT=<yourname> REGION=us-east-1 ./deploy-sandbox.sh`, substituting your domain for `ustc-case-mgmt.example.gov`.

If you want to point your local copy of the front-end to your sandbox, modify the API_URL in `web-client/environments/dev.js` to match the URL returned from the serverless deploy.
