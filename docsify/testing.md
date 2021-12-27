# Testing

## Unit Testing

## Integration Testing

## Smoke Tests

## Testing Matrix

At one point in this project, our team agree to do a quarterly manual test against our system.  We have a [Testing Matrix Google Sheet](https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA) which outlines a variety of different scenarios and the expected outcomes.  I'd recommend trying to at least read through some of this test matrix since it will give you good insight into a lot of the business rules our system need to uphold.

## Load testing

See [ustaxcourt/ef-cms-load-tests](https://github.com/ustaxcourt/ef-cms-load-tests) for Maven load tests.

#### Testing / Coverage Tips (TODO: REVIEW COPIED FROM DOCS)

- Run all tests with `npm run test`
- The web client, API, and shared code can be tested with `npm run test:client`, `npm run test:api`, and `npm run test:shared`, respectively
- Tip: When working through a single test, you can run a single test with `jest /path/to/test/file.js` (you may need to `npm -i -g jest`). Additionally, you can use `--watch` and `--coverage` flags to to continually run the specified test on save and provide a coverage report. For example: `jest /path/to/test/file.js --watch --coverage`

Example coverage output:
```
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |        0 |        0 |        0 |        0 |                   |
----------|----------|----------|----------|----------|-------------------|
```
- Stmts: % of statements executed in the code
- Branch: % of control structures (for example, `if` statements) executed in the code
- Funcs: % of functions executed in the code
- Uncovered Line #s: lines not covered by tests

### Accessibility HTML_CodeSniffer Bookmarklet

The following bookmarklet is useful for running pa11y directly on the page you are viewing.  The following link should have instruction on how to setup and use:

https://squizlabs.github.io/HTML_CodeSniffer/

#### Testing Everything via Docker (TODO: REVIEW FOR CORRECTNESS)

If needed, you can run all the tests locally by running the following:

```sh
./docker-test-all.sh
```

This will run the linter, Shellcheck, audit, build, test, Cypress, Cerebral tests, Pa11y, etc. over all the components.