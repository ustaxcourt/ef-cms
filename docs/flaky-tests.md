# Flaky Tests

Sometimes a test fails for no good reason. Simply re-running it may get it to pass. This is the definition of a flaky test. These can be quite annoying as they waste time rerunning and reduce the overall confidence in the tests themselves.

In order to combat flaky tests, we have introduced some tooling to help identify possible causes and zero in on solutions. 

## Telemetry

Whenever a Github action runs that performs one of our tests, we collect and report the behavior of the machine running the test. It shows CPU usage, memory allocation, and timing. This can be helpful to determine whether or not the runner may require additional resources in order to become more reliable. Look for CPU or memory maxing out while the tests are running as indicators that a more powerful runner or parallelism may be required improve test reliability.

To review the telemetry, simply navigate to one of the action runs, and the telemetry will be available in the pane below Artifacts.

1. Load up the repo https://github.com/ustaxcourt/ef-cms
1. Click [Actions](https://github.com/ustaxcourt/ef-cms/actions)
1. Type "`is:failure`" into the filter box and hit enter
1. Click on one of those actions, and find the telemetry under the Artifacts pane

## Artifacts

Every Cypress test produces a video that you can review to identify precisely where the test ran off track. This can help you pinpoint where to troubleshoot. Perhaps a click didn't fire and the subsequent expectation failed. Figuring out why that click didn't fire may be where you start. In any case, take a moment to review the video if it's available to see where it failed. 

## Isolation

Often times these flaky tests are only flaky in CI (Github Actions or CircleCI). And it can be a quite tedious to wait for all of the other tests to pass when you're only troubleshooting a single test. Try isolating the test you're working on and only running that one in CI.

Create a Github Actions workflow that uses a `push:` trigger rather than `pull_request:`. This way your action will run every time you push your branch. You can immediately see the effect of any changes you made every time you push.

Here's an example of isolating a Cypress Integration test:


```
name: E2E Cypress - Start a Case Practitioner

on:
  push:

jobs:
  e2e_cypress_specific_test:
    runs-on: ubuntu-latest

    env:
      CI: true
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.16.1'
      - name: Runs Elasticsearch
        uses: elastic/elastic-github-actions/elasticsearch@master
        with:
          stack-version: 7.10.2
          security-enabled: false
      - name: Setup DynamoDB Local
        uses: rrainn/dynamodb-action@v3.0.0
        with:
          port: 8000
          cors: '*'
      - name: Collect Workflow Telemetry
        uses: runforesight/workflow-telemetry-action@v1
        with:
          comment_on_pr: false
      - name: Install Node Dependencies
        run: npm ci
      - name: Run E2E Cypress
        run: |
          mkdir -p /tmp/cypress/
          npm run start:all:ci >> /tmp/cypress/cypress-output.txt &
          ./wait-until-services.sh
          sleep 5
          npm run cypress:integration:file cypress/cypress-integration/integration/start-a-case-practitioner.cy.ts
      - name: Store Cypress Failure Videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: ${{ github.workspace }}/cypress/cypress-integration/videos
```

The critical line in the above workflow is

```
npm run cypress:integration:file cypress/cypress-integration/integration/start-a-case-practitioner.cy.ts
```

This runs only the specified Cypress Integration test in isolation. Simply create a workflow in the `.github/workflows/` directory to ensure this test is run every time you push your branch. And be sure to remove this file when you are ready to submit a PR to the `staging` branch. 

Troubleshotoing flaky Unit tests or Cerebral integration tests could also employ a similar strategy.

## Workarounds and Solutions
