# Flexion Testing Approach

## Resources and Environments

### Tools
* Cerebral Debugger
* Cypress
* ESLint
* Jest
* Stylelint
* Voiceover
* ZenHub

### Testing Environments
* Local - Developer machines
* Exp 1 - Experimental environment where engineers can test potential solutions
* Exp 2 - Experimental environment where engineers can test potential solutions
* Exp 3 - Experimental environment where engineers can test potential solutions
* Flexion dev - Development environment where new code is introduced and preliminarily tested
* Flexion stg - Staging environment used to match the Court’s production environment
* Flexion prod - The place where we replicate the Court’s production environment

## What We Are Testing

### User Stories
For each user story that’s completed, the following testing is performed.

| Type of Testing        | Used for                                                                                                   | Automated or Manual  | Test Data Creation                                                                      | Tool                          | Responsible   | Frequency/Environment                            |
|------------------------|------------------------------------------------------------------------------------------------------------|----------------------|-----------------------------------------------------------------------------------------|-------------------------------|---------------|--------------------------------------------------|
| Experimental           | Testing potential engineering solutions without breaking dev                                               | Automated and Manual | Test data manually created with smoke tests.                                            | A variety of tools, as needed | Engineer      | * Exp1, Exp2 and Exp3 * As needed                |
| Lint                   | Style and catching common coding mistakes                                                                  | Automated            | Mock data defined in tests.                                                             | Eslint, stylelint             | Engineer      | * Every environment * Every PR and deploy        |
| *Unit                  | Verifying a small piece of code in isolation                                                               | Automated            | Mock data defined in tests.                                                             | jest                          | Engineer      | * Every environment * Every PR and deploy        |
| *Integration           | Verifying two or more pieces of code are working together as expected                                      | Automated            | Mock data defined in tests.                                                             | jest                          | Engineer      | * Every environment * Every PR and deploy        |
| E2E                    | Testing of features before deployment                                                                      | Automated            | Mock data defined in tests.                                                             | Cypress             | Engineer      | * Every environment * Before every PR and deploy |
| Smoke                  | Verifying that the entire system is working as expected from the perspective of the user with the browser. | Automated            | TestTest data defined in the smoke tests.  Any data created stays in the environment.   | Cypress             | Engineer      | * Every environment * After after every deploy   |
| Mobile                 | Features identified as external or public                                                                  | Manual               | Test data manually created.                                                             |                               | UX Designer   | Flexion dev  Per GitHub story as needed          |
| Accessibility          | Features identified as external or public                                                                  | Automated and Manual | Mock data defined in automated tests for Cypress.  Test data manually added for Voiceover | Cypress, Voiceover              | Engineer      | * Flexion local env * Per GitHub story as needed |
| Functional             | Targeted testing done when a new feature / story is completed and prior to QA                              | Manual               | Test data manually created.                                                             |                               | UX Designer   | * Flexion dev * Per GitHub story                 |
| Quality Assurance (QA) | Targeted testing done when a new feature / story is completed                                              | Manual               | Test data manually created.                                                             |                               | Product Owner | * Flexion prod * Per GitHub story                |

*Unit and Integration tests have 98% test coverage.

### Testing of Key Features and Workflows
Features/workflows will be prioritized and tested each sprint if they meet any of this criteria:
* Involves a data breach of sensitive information or a security vulnerability
* Involves a risk that data will be lost and not recoverable
* Causes a complete work stoppage for Court employees

For each sprint, the Product Owner will define which key features and workflows to test.

Comprehensive List of System Flows and Expected Results:
https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA/edit?usp=sharing

| Type             | Used for                                                 | Automated or Manual | Test Data Creation                               | Tool              | Responsible | Frequency / Environment          |
|------------------|----------------------------------------------------------|---------------------|--------------------------------------------------|-------------------|-------------|----------------------------------|
| "Key regression" | Testing of key features and workflows (as defined below) | Manual              | Test data manually created                       |                   | UX Designer | Flexion prod End of each sprint  |
| "Key" smoke      | Testing of key features and workflows after deployment   | Automated           | Manually created data w/in a pool of "like" data | Cypress | Engineer    | Flexion prod End of each sprint  |

### Testing of Low Priority Features and Workflows
For low priority features, testing will be done on an as-needed basis.

### Testing After a Major Refactoring
Before a major refactoring, the team will perform a pre-mortem, which will help guide testing.

| Type          | Used for                                                                                                                 | Automated or Manual  | Test Data Creation                                               | Tool | Responsible | Frequency / Environment |
|---------------|--------------------------------------------------------------------------------------------------------------------------|----------------------|------------------------------------------------------------------|------|-------------|-------------------------|
| Full System   | Full testing of all features and workflows                                                                               | Manual               | Test data manually created within a pool of production-like data |      |             | Flexion prod            |
| Mobile        | Full mobile review of all features for unauthenticated public site, file a petition flow and file a document flow        |                      | Test data manually created within a pool of production-like data |      |             | Flexion prod            |
| Accessibility | Full accessibility review of all features for unauthenticated public site, file a petition flow and file a document flow | Automated and Manual | Test data manually created within a pool of production-like data |      | Engineer    | Flexion prod            |


### Final Testing Before Launch
| Type          | Used for                                                                                                                 | Automated or Manual  | Test Data Creation                                               | Tool | Responsible | Frequency / Environment               |
|---------------|--------------------------------------------------------------------------------------------------------------------------|----------------------|------------------------------------------------------------------|------|-------------|---------------------------------------|
| Full System   | Full testing of all features and workflows                                                                               | Manual               | Test data manually created within a pool of production-like data |      |             | Flexion prod Completed by code freeze |
| Mobile        | Full mobile review of all features for unauthenticated public site, file a petition flow and file a document flow        |                      | Test data manually created within a pool of production-like data |      |             | Flexion prod Completed by code freeze |
| Accessibility | Full accessibility review of all features for unauthenticated public site, file a petition flow and file a document flow | Automated and Manual | Test data manually created within a pool of production-like data |      | Engineer    | Flexion prod Completed by code freeze |

## Process

### Issue Tracking
When either Flexion or the USTC identifies a bug or new feature that’s needed, the following steps should be taken:
* Confirm and identify the issue
* Log issues Zenhub using either the bug template for bugs or story template for new features
* Complete all fields the bug or story template
* Add a severity tag for bugs
* Add bug to a bug epic for tracking purposes

### Bug Severity / Prioritization

#### Severity Definition
**Critical**
* Blocks entire system's or module’s functionality
* No workarounds available
* Testing cannot proceed further without bug being fixed.

**High-Severity**
* Affects key functionality of an application
* There's a workaround, but not obvious or easy
* App behaves in a way that is strongly different from the one stated in the requirements

**Medium-Severity**
* A minor function does not behave in a way stated in the requirements.
* Workaround is available and easy

**Low-severity Defect**
* Mostly related to an application’s UI
* Doesn't need a workaround, because it doesn't impact functionality

## Recommendations to Tax Court
As part of launch readiness, Flexion recommends the following roles and methods for testing code in the USTC environments.

### Roles and Responsibilities
#### Tax Court Test Team
Product Owner/tech lead could identify a Tax Court Test Team that could consist of an individual from each user role (i.e. Petitions, Docket, Chambers, etc.).
* Responsible for performing manual testing at regular identified intervals
* Responsible for logging all issues found in [Tax Court mechanism??]

#### Tech Lead
* Verify any issues identified by Tax Court Test Team during manual testing
* Liaise with Flexion Test Team to log all confirmed bugs

#### Product Owner
* Perform functional testing per GitHub issue as part of Definition of Done
* Prioritize issues in Flexion backlog

### Approach Recommendations
In addition to testing in Flexion’s environments, we also recommend the following testing be done in the Court’s environments.

#### Now Through Final Migration
* Form testing team
* Multiple successful dry runs of migration and launch
* Perform multiple dry runs until they are successful
* Establish currently undefined processes for bug resolution, etc (“What ifs from launch doc)
* Test Blue/Green deployment in production
* System Testing:
    * Test key features and workflows
    * Pen
    * Load
    * Chaos Monkey
    * Automated testing that comes w/each deploy

#### After Final Migration and Deployment to Production and Before Go-Live
* Full system testing of all features and workflows, including mobile and accessibility

#### Ongoing Testing
**After every sprint**
* Test completed user stories
* Test key features and workflows
* Establish a cadence for testing low priority features and workflows. There may be features that don’t get used often and we possibly wouldn’t know something is broken.
