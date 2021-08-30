# How to run Artillery Performance Tests

## How to run the order tests

The order tests will only hit the order search endpoint.  Before you can run these tests, you'll need to populate the 
`tokens.csv` file.  Setup your ENV variables with the following to point to the ENV you want to test against:

- USER_POOL_ID
- CLIENT_ID
- DEFAULT_PASS
- REGION

After exporting those ENV variables, you can run the following script `cd artillery && ./generate-tokens.sh`.

This will create JWT tokens and put them in a `tokens.csv` file which is later used as an artillery payload.

`DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance:order`

## How to run the ES performance tests

The ES tests will hit a majority of our API endpoints that use elasticsearch behind the scenes.  You can run these tests via the following command:

`AUTH_TOKEN=XZYZ DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance`
