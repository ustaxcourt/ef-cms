
# Best Practices

In order to write a realiable cypress test suites, there are some best practices we should follow that our outlined in the cypress documentation and also some best practices we have learned from trying to write realiable tests.

## DO'S
- Access DOM elements using `data-testid selector`.
  -  Any element you need to click or find in the UI must have a `data-testid` attribute. Test ids are preferred because other attributes such as classes and ids change when making style changes; whereas, it's obvious when you see a data-testid that a cypress test uses that element.
  - For example, if you need to click on a button on from inside a test, your button should look like this `<button data-testid="my-button">submit</button>`.
  - Avoid cy.get('.my-class').
  - Avoid cy.get('#my-id').
- Wait for actions to finish explicitly.
  - Always verify something on the page after running an action or loading a new page.  For example, if you click on a button which updates a practitioner name, be sure to wait for a success alert to appear before trying to move onto the next steps in your test.  Failing to do this will result in race conditions and flaky tests.  
  - This is especially important for accessibilty tests, wait explicitly for the page to full load before running an accessibility scan. If you are seeing 'color-contrast' violations that are intermittent you are most likely not waiting for the right element to be loaded before running a scan.
- Extract reusable steps.
  - Try to find ways to create helper functions which we can re-use in other tests.  For example, creating a case as a petitioner is a good re-usable flow.  When writing these helpers, be sure they do not contain asserts related to the high level test you are writing.  They should just login as a user, create or modify the data, then return any new created values we may need.
- Test should be re-runnable.
  - Any cypress test should be able to be re-run any number of times without failing. For example, a poorly written test might add a docket entry to a case and expect the number of docket entries to be 12. This test will pass the first time it is run but fail the second time it is run as there are now 13 docket entries.

## DONT'S
- Rely on other tests for setup/
  - Every `it` statement should be a repeatable test that should be able to run in isolation.  This means your `it` statement shouldn't depend on a previous it statement to pass.  If you write tests that depend on previous it statements, your tests can become flaky.
- Rely on seed data for setup.
  - Each test should create whatever data it needs to pass. Relying on seed data can make tests flakey and hard to debug, if multiple tests rely on a case and make changes to it, randomizing their run order or adding a third test that makes changes to that case will produce inconsistent, confusing test failures. 
- Rely on spinners to indicate when an action has completed.
  - Depending on how fast the machine the test is running on, a spinner might hide and show faster than Cypress can even listen for it to show up. Instead, wait for something in the UI to change after a successful mutation in the system, such as listening for a URL redirect or a success alert to show.
- Do things a user would NOT do.
  - The goal of the tests is to verify the application is working as a user would interact with it. For example a majority of users are not going to enter an exact url of a feature in DAWSON when they navigate. Therefore avoid using `cy.visit`  
  - Avoid `cy.intercept`. This is coupling our tests to a lower level API implementation detail which can make our tests harder to refactor in the future.
- Rely on `after` hooks.
  - Instead any setup should be performed in a `before` hook. Running code in an `after` can potentially not get run because cypress will stop a test early on a failure which means your after will not run.
- Use aliases
  - Instead use nesting of chainables in cypress tests.  Please review the `cypress/local-only/tests/integration/respondent-modifies-contact-info.cy.ts` test.  Aliases are basically global variables that are very hard to understand.  If you have a helper function that creates a case and need to return a docket number, just have the function return a cy.wrap(docketNumber).  Aliases are also harder to hook up with typescript and makes it harder to follow the code.


# Test Organization
- Local tests vs deployed tests vs production tests vs public tests.
  - `local-only`folder is for tests that are meant to only run locally and in gitHub Actions
  - `deployed-and-local`folder is for tests that are meant to run locally, in gitHub Actions, and against deployed environments.
  - `readonly` folder is for tests that are meant to be run against deployed environments, and against production as they do not create any test data.
  - All of these folders may also have a subfolder for tests that are meant to run against the public site. So a test that you would want to be run against public and only locally belongs in `local-only > integration > public`.

## Integration and Smoketests
- Organize Cypress test by feature. 
  - For example, a test that verifies a paper filed docket entry displays a served date after it has been served would belong under `caseDetail > docketRecord > paperFiling` because the feature under test is the behavior of a paper filed docket entry. 
- If multiple users use the same feature, create a new test for each user if they interact with it differently.
  - For example, a docket clerk and a judge both have a dashboard page, but those pages function differently from one another so two tests files should be created under `dashboard > docketClerk.cy.ts` and `dashboard > judge.cy.ts`. 
- Organize helper functions by feature.
  - Helper functions that perform often repeated steps (such as creating and serving a case, granting e-access) are organized similarly as tests under `cypress >helpers`.
  - For example, a helper function that creates a paper petition should be organized under `helpers > fileAPetition`.
  - Helper functions that connect to or interact with lower level services (Dynamo, Cognito, etc.) or run Node functions from within a Cypress task are organized under `helpers > cypressTasks`.
- Tests for individual React components should be placed under `components > <COMPONENT_NAME>`.
  - For example, we have custom validation logic for the date picker component, the test for that validation is placed at `components > datePicker > date-picker-validation-invalid-year.cy.ts`.

## Accessibility
- Accessibility tests are organized by route. 
  - For example, a test that verifies the accessibility of the page `Advanced Search` - including the Case/Opinion/Order/Practitioner tabs would belong under `advancedSearch > <USER>.cy.ts` because the individual search tabs are not associated with their own route.  


# Learn More

For more content related to best practices, please consider reading the following:

 - [cypress best practices guide](https://docs.cypress.io/guides/references/best-practices).  
 - [hour stream about some cypress employee talking about best practices](https://www.youtube.com/watch?v=PPZSySI5ooc).  
 - [short video about best practices](https://www.youtube.com/watch?v=eBKYm7F05vY)
 - [There is another video](https://www.youtube.com/watch?v=5XQOK0v_YRE) made by one of the creators of cypress, but I'm not convinced his best practices are actually good.  He recommends testing each page in isolation which would mean pre-seeding the database or mocking out api calls.  I personally believe this will put us back in a state where we are tightly coupled to implementation details and will make the test suites too coupled to api endpoints or database structures.