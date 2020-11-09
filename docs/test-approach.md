## Flexion Testing Approach

### Resources and Environments

#### Tools
* Cerebral Debugger
* Cypress
* ESLint
* Honeybadger
* Jest
* Pa11y
* Stylelint
* Voiceover
* ZenHub

#### Testing Environments
* Local - Developer machines
* Exp 1 - Experimental environment where engineers can test potential solutions
* Exp 2 - Experimental environment where engineers can test potential solutions
* Exp 3 - Experimental environment where engineers can test potential solutions
* Flexion dev - Development environment where new code is introduced and preliminarily tested
* Flexion stg - Staging environment used to match the Court’s production environment
* Flexion prod - The place where we replicate the Court’s production environment

### What We Are Testing

#### User Stories
For each user story that’s completed, the following testing is performed.

| Type of Testing        | Used for                                                                                                   | Automated or Manual  | Test Data Creation                                                                      | Tool                          | Responsible   | Frequency/Environment                            |
|------------------------|------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------|-------------------------------|---------------|--------------------------------------------------|
| Experimental           | Testing potential engineering solutions without breaking dev                                               | Automated and Manual | Test data manually created with smoke tests.                                            | A variety of tools, as needed | Engineer      | * Exp1, Exp2 and Exp3 * As needed                |
| Lint                   | Style and catching common coding mistakes                                                                  | Automated            | Mock data defined in tests.                                                             | Eslint, stylelint             | Engineer      | * Every environment * Every PR and deploy        |
| *Unit                  | Verifying a small piece of code in isolation                                                               | Automated            | Mock data defined in tests.                                                             | jest                          | Engineer      | * Every environment * Every PR and deploy        |
| *Integration           | Verifying two or more pieces of code are working together as expected                                      | Automated            | Mock data defined in tests.                                                             | jest                          | Engineer      | * Every environment * Every PR and deploy        |
| E2E                    | Testing of features before deployment                                                                      | Automated            | Mock data defined in tests.                                                             | Cypress and Pa11y             | Engineer      | * Every environment * Before every PR and deploy |
| Smoke                  | Verifying that the entire system is working as expected from the perspective of the user with the browser. | Automated            | TestTest data defined in the smoke tests.  Any data created stays in the environment.   | Cypress and Pa11y             | Engineer      | * Every environment * After after every deploy   |
| Mobile                 | Features identified as external or public                                                                  | Manual               | Test data manually created.                                                             |                               | UX Designer   | Flexion dev  Per GitHub story as needed          |
| Accessibility          | Features identified as external or public                                                                  | Automated and Manual | Mock data defined in automated tests for Pa11y.  Test data manually added for Voiceover | Pa11y, Voiceover              | Engineer      | * Flexion local env * Per GitHub story as needed |
| Functional             | Targeted testing done when a new feature / story is completed and prior to QA                              | Manual               | Test data manually created.                                                             |                               | UX Designer   | * Flexion dev * Per GitHub story                 |
| Quality Assurance (QA) | Targeted testing done when a new feature / story is completed                                              | Manual               | Test data manually created.                                                             |                               | Product Owner | * Flexion prod * Per GitHub story                |
