# Testing

This part of the documentation will explain the various types of automated tests we write in Dawson, and how to run them.

## Unit Testing

Unit testing is our first line of defense to verify our application meets the business requirements defined by the Court.  All of our code is unit tested using [Jest](https://facebook.github.io/jest/), and we strive to **keep code coverage >= 95% when possible**.

If you want to run the unit tests, you can do so with one of the following commands:

- `npm run test:client:unit`
- `npm run test:shared`
- `npm run test:api`

These run all unit tests in the `client`, `shared`, and `api` directories, respectively.

Often you just want to run a single test file.  You can do that using the following command:

`npx jest <PATH_TO_TEST_FILE>`

?> if the implementation is considered an **humble object** -- code that has no branching and very simple passthrough logic -- we often ignore it from testing.

### Overview of Jest

For every function and module, we write a unit test file with a matching *.test.js extension.  For example, if we have a `getClientId.js` file, we'll have a `getClientId.test.js` file in the same directory which verifies the public interface of that module or function.

Jest tests are setup by declaring `describe` and `it` blocks.  The `describe` block is a group of related tests.  The `it` block is a single test.  The `it` block can have multiple assertions.  For example, we might have a test that verifies that the `getClientId` function returns a string.  We might also have a test that verifies that the `getClientId` function returns a string with a length of 32 characters.  We can have multiple `it` blocks in a `describe` block.

For example:

```javascript
const { getClientId } = require('./getClientId');
describe('getClientId', () => {
    it('returns a string', () => {
        expect(getClientId()).toBeString();
    });

    it('the string should be 32 characters long', () => {
        expect(getClientId()).toHaveLength(32);
    });
});
```

Each `it` statement should be a small test with a single assertion (if possible).  The reason we keep tests small is so that we can verify when specific parts of a function are broken instead of having the entire test suite fail when something goes wrong.

### Mocking

Most of our code in Dawson is passed in an applicationContext which is where we have our third party dependencies setup via dependency inversion.  It's pretty easy to mock dependencies on the applicationContext because we can just define a new function using `jest.fn()` which will create a jest mock that we can use to verify that the function was called.  For example:

```javascript
const { getClientId } = require('./getClientId');
it('should invoke fetch', () => {
    const getMock = jest.fn();
    getClientId({
        applicationContext: {
            get: getMock,
        }
    })
    expect(getMock).toBeCalled();
})
```

Unfortunately, we often need to mock out dependencies that do not live on the applicationContext.  For example, if we pretend the `getClientId` method requires another function from a DateHandler module, we might need to mock it out using `jest.mock` function, like so:

```javascript
// mock out ONLY the 'createISODateString' function while allowing original implementations
const { createISODateString } = require('../utilities/DateHandler');
jest.mock('../utilities/DateHandler', () => {
  // import the original DateHandler module
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(), // mock out the createISODateString function
  };
});

describe('getClientId', () => {
  beforeAll(() => {
    createISODateString.mockReturnValue('2019-02-01T22:54:06.000Z');
  });

  it('should save iso date', async () => {
      // the function will now use the mock date when DateHandler is invoked
      getClientId();
  });
});
```

The example above is used specifically when we want to use a majority of the original implementation of the module, but maybe just mock out a few functions on the module.  

!> jest.mock is a bit confusing - a good rule of thumb is to write your implementation in such a way that won't require you to jest.mock a lot of things.


## Integration Testing

Since we know unit tests are not perfect and will miss potential bugs, we incorporate a lot of integration tests against Dawson to verify our code.  Our integration tests test at the presenter level (i.e. we test the Cerebral sequences which will hit our API, Dynamo, and Elasticsearch).  We try to avoid testing at the React level due to additional complexity, brittleness, and slowness.

You can run the all of the integration tests locally with the following command, but they will take **a long time**.

`npm run test:client:integration`

Often the best way to write and run integration tests is by using the following command which will run just the single integration test:

`npm run test:file <PATH_TO_FILE_HERE>`

!> when running an integration test, remember to use the `test:file` script and not `npx jest` or the tests will fail with strange errors.

!> Your API must be running in order to run the integration tests.

### How Integration Tests are Set Up

The integration tests are located in `web-client/integration-tests`.  We tried to take a declarative approach in writing these tests.  Each test file is made up of smaller helper test files that are found in `web-client/integration-tests/journey`, where each journey file is a small step in the larger integration test scenario.

For example, the `web-client/integration-tests/admissionsClerkPractitionerJourney.test.js` test invokes multiple journey functions like so to create a petition, serve the petition, and add a practitioner to the case:

```javascript
describe('admissions clerk practitioner journey', () => {
//... code above omitted for brevity
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseDetail(cerebralTest);
    petitionsClerkServesPetitionFromDocumentView(cerebralTest);
    petitionsClerkAddsPractitionersToCase(cerebralTest, true);
//... code below omitted for brevity
});
```

?> Try to keep the journey functions small and reusable by other tests in the future if needed. 

## Cypress Tests

Cypress is a great tool for writing and running end-to-end tests against web interfaces. By default, Cypress leverages headless instances of browsers, meaning that they do not run in a visual window.

### NPM Scripts

The following is the complete list of commands useful in running the Cypress scripts we've defined:

- `npm run cypress:integration:open`
- `npm run cypress:integration:public`
- `npm run cypress:integration`
- `npm run cypress:readonly:open`
- `npm run cypress:readonly:public:open`
- `npm run cypress:readonly:public:open:local`
- `npm run cypress:readonly:public`
- `npm run cypress:readonly`
- `npm run cypress:smoketests:local`
- `npm run cypress:smoketests:open:local`
- `npm run cypress:smoketests:open`
- `npm run cypress:smoketests`

?> NOTE:\
?> The `ENV` environment variable and AWS Credentials must be exported in your shell to run many of these scripts successfully.

?> NOTE:\
?> Tests run against the deployed environment by default are run against the `DEPLOYING_COLOR` as these tests exist to ensure the CI process does not deploy broken code.

#### Integration

The scripts containing the word `integration` run tests that rely on no externally running resources. They do require local instances of the API and data stores, as well as the client under test. Refer to the [Integration Testing](#integration-testing) section for further details.

#### Smoketests

Testing all our functionality locally is a good way to catch bugs, but often when we deploy all our code to AWS, stuff is misconfigured which causes things to break.  For this reason, we have a variety of smoketests written in Cypress to make sure a user can at least click through the UI and run a couple of key pieces of functionality.

The scripts containing the words `smoketests` run tests that rely on externally running resources, some of which may persist data or modify persisted data.

#### Readonly

The scripts containing the word `readonly` run special smoketests that rely on externally running resources, but do not call any endpoints that persist data or modify persisted data.

#### Open

The Cypress CLI runner also provides a useful `open` command which will load a browser instance locally, which developers can use to watch the tests click through the UI and rewind history.

#### Public

The scripts containing the word `public` run tests against the public client.

#### Local

Many of the Cypress tests may be run against the locally running resources. 

?> NOTE:\
?> This is not needed for `integration` tests because they only run against locally running resources.

### Manual Runs

Rather than running using the pre-defined NPM scripts, you may want to try a  different combination of options. This can be done by running `./scripts/run-cypress.sh` with options. There is a help function available to describe the options available. It can be run with the following command:

```shell
./scripts/run-cypress.sh -h
```

?> NOTE:\
?> Not all options are compatible and no guarantee exists that any particular run of this shell script will represent a valid test. Care should be taken to ensure the options chosen are valid before defining a new NPM script intended to be run by CI. 

## Testing Matrix

At one point in this project, our team agreed to comprehensively manually test our system on a quarterly basis.  We have a [Testing Matrix Google Sheet](https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA) which outlines a variety of different scenarios and the expected outcomes.  I'd recommend trying to at least read through *some* of this test matrix since it will give you good insight into many of the business rules our system needs to abide by.

## Testing / Coverage Tips

You can put the following command into your .bashrc file to have code coverage display when running unit tests individually:

```bash
npx() {
    if [[ $@ == "jest"* ]]; then
        coverage_file=$(echo "$@" | sed -e "s/jest[[:space:]]*//" -e "s/.test//")
        command npx jest "$@" --coverage --collectCoverageFrom "$coverage_file"
    else
        command npx "$@"
    fi
}
```

This will print coverage whenever you run `npx jest <PATH_TO_TEST_FILE>`, which is really useful for development.

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

### Accessibility Extension

In addition to automated cypress tests, the following extension is useful for manually running accessibility scans on individual pages.

https://www.deque.com/axe/devtools/chrome-browser-extension/

## Testing Everything via Docker

!> developers don't develop with docker locally, so this might not work as expected

If needed, you can run all the tests locally by running the following:

```sh
./docker-test-all.sh
```

This will run the linter, Shellcheck, audit, build, test, Cypress, Cerebral tests, etc. over all the components.


## PDF Testing

Since our system generates a lot of PDFs, we have a set of tests that verify the PDFs didn't change using a checksum of the first exported image of the PDFs.  Since all of these PDFs share a single .scss file, there is risk involved when trying to update a single PDF to accidentally change the styles of other PDFs.  Therefore, we have a set of tests that verify that the PDFs are not changing.

All of the expected output images are found in the `./shared/test-pdf-expected-images` directory.  In order to update these, you will need to run the following command:

```
docker build --platform=linux/amd64 -t efcms -f Dockerfile . && \
docker build --platform=linux/amd64 -t efcms-local -f Dockerfile-local . && \
docker run --platform=linux/amd64 -it --rm -v `pwd`/shared/test-output:/home/app/shared/test-output efcms-local sh -c "npm run test:document-generation"
```

After inspecting the failed pdfs, override the existing the pdfs by running the following command:
```cp -r shared/test-output/*.png shared/test-pdf-expected-images/```

### M1 Users
Before running the commands above: 
- turn on the setting for Rosetta emulation in Docker Desktop (don't forget to apply and restart)
- add the line `export DOCKER_DEFAULT_PLATFORM=linux/amd64` to your `.zshrc`


If you're getting errors, try running `docker system prune -af` and run the commands again. 

## Client Integration Testing
If you want to be able to run `build-client-integration` tests within a Docker container locally for debugging purposes without deploying, you could use these commands.

```
docker build -t efcms -f Dockerfile . && \
docker build -t efcms-local -f Dockerfile-local . && \
docker run -it -v `pwd`/shared/test-output:/home/app/efcms/shared/test-output efcms-local sh -c "./run-integration-tests.sh"
```
