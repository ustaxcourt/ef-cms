# Cypress for Integration Testing

This document aims to outline the issues with our current integration testing approach and propose the adoption of Cypress for future tests. We have read through various best practices of cypress and outlined them in this document as a guideline for writing future cypress tests.

## Issues with Current Integration Tests

Right now, a major way we verify the functionality of our application today is via integration tests.  These tests have been our main safety net to ensure modifying existing functionality in the system doesn't introduce breaking changes, but they have some issues:

- Our integration tests are tightly coupled to cerebral.js.  This coupling makes it harder to potentially refactor cerebral out of our system since it depends on testing utilities provided from the cerebral package.  Cerebral is no longer maintained which is one major reason we do not like this coupling
- Our integration tests are very hard to debug when they fail.  We have seen flaky tests fail and not give any insightful errors.
- writing the tests requires understanding the sequences our UI invokes (implementation detail) which often means if you want to write a test to click a button, you have to dive through code to figure out what sequence the button calls and what state must already exist in the cerebral store before you can invoke the sequence.  It's very complex to write a simple test.

Overall, we'd like to move away from these type of tests since they are harder to write, maintain, and debug when they randomly fail in our ci pipeline.


## A Proposed Alternative using Cypress

We use cypress in our project for a smaller suite of integration tests and e2e smoketests. Cypress is an e2e test runner which runs higher level tests in a browser. 

### Cypress Benefits Over Cerebral Integration Tests
- Cypress tests are written at the dom level (highest abstraction), this means we will not be coupled to any lower level implementation detail like we currently are with cerebral.  This enables our system for easier refactoring in the future.
- Cypress facilitates easier debugging of test failures by automatically generating videos, allowing us to visually inspect issues. This contrasts with our current integration tests, where identifying problems involves sifting through extensive logs to locate server errors. Additionally, Cypress supports the capture of screenshots during testing.
- Cypress seems to run faster than our current integration tests suites.  We made two identical test flows to see if cypress was slower or faster than our integration tests.  We found that cypress actually runs faster than our integration tests by a large margin.
- Writing tests is a lot easier in cypress.  Writing tests in cypress often involves just knowing the testid of the dom element and calling it in the test.
- Cypress provides tooling to make writing tests fast.  They have an experimental flag which allows developers to click through a UI and record all of the interactions we made with the UI.  The test files are automatically generated for us using this flag.
- Cypress has built in retry and wait-for mechanisms.  This makes writing stable tests easier because we can just wait for dom elements to appear or hide when dealing with async actions.  For example, if we change the address of a practitioner, it's very easy to just wait for the progress indictator to hide by writing cy.get('[data-testid="progressIndicator"]').should('not.exist') and cypress will wait until that condition is true.
- Cypress tests can easily be ported to e2e smoketests which we depend on before doing a blue green color switch.  If we decide we want more testing in our smoketests, it will be easy to just copy tests over.
- When dealing with async related functionality, such as elasticsearch, try to use the `retry` helper and re-run a particular query or reload a page and continously check until the element you need is displayed. 
- avoid `cy.wait`; if you feel you need to wait, there is probably a more elgant way to retry actions until your results show
- do not create re-usable helper functions until you see identical test code that could be abstracted
- do not create re-usable helper functions for smaller actions (like clicking a link to navigate to a new page); helper functions should be used for setting up particular test data before running the test

### General Cypress Downsides
- Cypress tests are e2e tests which generally means they are slow to run and will be more flakey than unit level tests. This is generally true of the nature of all e2e tests.
- We are still coupled to a system for running our tests, now our tests will be coupled to Cypress and the Web Browser.
- When a test fails in cypress it will not be clear what piece of functionality is broken, what will fail is a DOM element that could not be found. In an ideal world when a test fails the developer can know exactly why it is failing.


## A Path Forward

Overall we feel cypress is a better testing approach compared to our home brewed integration test suite.  Cypress is also very common in the industry with 45k github stars, it's still activelty maintained, and it's backed by an actual company.  Because of this, onboarding new developers to the Dawson project is easier since cypress is well known.  The ability to watch cypress videos when tests fail is invaluable in debugging flaky tests, and writing these tests is a lot easier than our current approach. The downside of coupling ourselves to a 3rd party framework for testing key functionality is not as great as the downside of needing to create/maintain our own custom version of testing for the application.

We propose that all future integration and e2e tests are written in cypress.  We feel this will allow us to not only slowly decouple from cerebral, but also build up a more realiable test suite.  We also recommend that any existing integration tests that are flaky should be rewritten in cypress.  We've had a lot of flaky integration tests fail on github actions and circle, and refactoring them to cypress might be a good solution to make our test suites more stable.

At some point we may decide to slowly refactor existing integration tests into cypress tests with the hopes to be able to remove cerebral from our system and not lose all our test coverage.
