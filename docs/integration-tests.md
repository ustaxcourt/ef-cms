
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

## Best Practices

In order to write a realiable cypress test suites, there are some best practices we should follow that our outlined in the cypress documentation and also some best practices we have learned from trying to write realiable tests.

- every `it` statement should be a repeatable test that should be able to run in isolation.  This means your `it` statement shouldn't depend on a previous it statement to pass.  If you write tests that depend on previous it statements, your tests can become flaky.  This also goes against the best practices outlined in the cypress docs.
- dom elements should be accessed using our custom cypress command `cy.get('[data-testid="YOUR_ID"]')`.  This means any element you need to click or find in the UI must have a `data-testid` attribute.  The reason test ids are prefered is that some attributes such as classes and ids can accidently be changed when making style changes; whereas, it's obvious when you see a data-testid that a cypress test uses that element.
  - for example, if you need to click on a button on from inside a test, your button should look like this `<button data-testid="my-button">submit</button>`
  - avoid cy.get('.my-class')
  - avoid cy.get('#my-id')
- always verify something on the page after running an action or loading a new page.  For example, if you click on a button which updates a practitioner name, be sure to wait for a success alert to appear before trying to move onto the next steps in your test.  Failing to do this will result in race conditions and flaky tests.  
  - Here is an example scenario where you may write a bad cypress test:  Your test clicks a button but then directly calls cy.visit().  This will redirect to a new page but your api request might still be running (especially if doing an action which does PDF generation).  This means you'll load the new page and expect data to exist, but it never will.  Be sure to wait for something, such as a success alert, after clicking the button before redirection.
- avoid waiting on spinners to show and hide.  Depending on how fast the machine is, the spinner might hide and show faster than cypress can even listen for it to show up.  This can cause a flaky test.  We recommend to just wait for something in the UI to change after a successful mutation in the system, such as listening for a URL redirect or a success alert to show.
- avoid `cy.visit` unless you're specially trying to verify how a page acts on an initial fresh load.  The goal of the tests are to verify the application working as a user clicks through our links and buttons.  Entering urls directly isn't something a user will be doing; test like a user would be using.  Also, cy.visit will clear cookies and often cause issues in tests resulting in random authentication errors.
- try to avoid `cy.intercept`.  This again is coupling our tests to a lower level API implementation detail which can make our tests harder to refactor in the future.
- don't use `after` in cypress.  Any database setup should be in a `before` setup.  Running code in an `after` can potentially never get ran because cypress can stop a test early on a failure which means your after will never run.
- avoid using aliases, we recommend just using nesting of chainables in cypress tests.  Please review the `cypress/cypress-integration/integration/respondent-modifies-contact-info.cy.ts` test.  Aliases are basically global variables that are very hard to understand.  If you have a helper function that creates a case and need to return a docket number, just have the function return a cy.wrap(docketNumber).  Aliases are also harder to hook up with typescript and makes it harder to follow the code.
- try to find ways to create helper functions which we can re-use in other tests.  For example, creating a case as a petitioner is a good re-usable flow.  When writing these helpers, be sure they do not contain asserts related to the high level test you are writing.  They should just login as a user, create or modify the data, then return any new created values we may need.

For more content related to best practices, please consider reading the following:

 - [cypress best practices guide](https://docs.cypress.io/guides/references/best-practices).  
 - [hour stream about some cypress employee talking about best practices](https://www.youtube.com/watch?v=PPZSySI5ooc).  
 - [short video about best practices](https://www.youtube.com/watch?v=eBKYm7F05vY)

 There is [another video](https://www.youtube.com/watch?v=5XQOK0v_YRE) made by one of the creators of cypress, but I'm not convinced his best practices are actually good.  He recommends testing each page in isolation which would mean pre-seeding the database or mocking out api calls.  I personally believe this will put us back in a state where we are tightly coupled to implementation details and will make the test suites too coupled to api endpoints or database structures.