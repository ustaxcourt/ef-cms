# Artillery Performance Tests

## How to run the order tests

The order tests will only hit the order search endpoint.  Before you can run these tests, you'll need to populate the 
`tokens.csv` file.  Setup your ENV variables with the following to point to the ENV you want to test against:

- USER_POOL_ID
- CLIENT_ID
- DEFAULT_ACCOUNT_PASS
- REGION

After exporting those ENV variables, you can run the following script `cd artillery && ./generate-tokens.sh`.

This will create JWT tokens and put them in a `tokens.csv` file which is later used as an artillery payload.

`DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance:order`

## How to run the ES performance tests

The ES tests will hit a majority of our API endpoints that use elasticsearch behind the scenes.  You can run these tests via the following command:

`AUTH_TOKEN=XZYZ DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance`


## Changing Parameters

Artillery tests are defined in the `yml` files located in the `/artillery/` directory, which use the following configuration properties:

- target, the url to test against
- plugins, any artillery plugins (we use one to get the average response times for each endpoint)
- phases, you can break up your test into phases, where each phases runs in order before the next.  This is useful if you want to ramp up your test users before doing a sustained load test
- payload, where you can load in .csv files and randomly select values from it in your tests

In artillery, there are two main ways to change the amount of users hiting your api.  Inside the config.phases property, you can change the length of time in the performance test via changing the `duration` parameter.  You can set `arrivalRate` or `arrivalCount` to change the number of users the performance test simulate.  `arrivalRate` is how many users will run your scenarios per second.  So a rate of 5 means there will be 5 random scenarios ran every second.  `arrivalCount` is the total amount of users that will run your scenarios over the course of the entire performance tests.  For example, if your test duration 5 minutes, and you have an arrivalCount of 100, that means you will have about 300s / 100 = 1 request every 3 seconds.

In regards to the https://github.com/flexion/ef-cms/issues/8793 story, this is how the breakdown would work:

For X and Y, if you are using `arrivalCount`, you need to calculate the duration / arrivalCount to figure out how many X requests happen every Y seconds over a duration of Z.

For X, if you are using `arrivalRate`, the arrivalRate will be how many requests happen every second.  So arrivalRate of 10 means 10 requests a second.

For XX and YY, there is a `private-app-report.json` and `private-advanced-order.json` which prints out the number of counts for status codes and the mean response times. 

```
"case-deadline-search": {
  "min": 328,
  "max": 570,
  "median": 372,
  "p95": 476.3,
  "p99": 569.6
},
"counters": {
  "code 200 on messages-user-completed": 79,
  "code 429 on advanced-document-search": 10
},
```

We don't currently throw an error code if these cross a certain threshold, but it should be easy to parse the json using `jq` to check the median is within a threshold, or the 429 errors are under a certain amount.
