---
name: Bug Report
about: 'Template for USTC bugs. '
title: 'BUG: '
labels: ''
assignees: ''

---

**Describe the Bug**
A clear and concise description of what the bug is.

**Business Impact/Reason for Severity**

**In which environment did you see this bug?**

**Who were you logged in as?**

**What were you doing when you discovered this bug? (Using the application, demoing, smoke tests, testing other functionality, etc.)**

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Actual Behavior**
A clear and concise description of what actually happened.
**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Cause of Bug, If Known**


**Process for Logging a Bug:**
* Complete the above information
* Add a severity tag (Critical, High Severity, Medium Severity or Low Severity). See below for priority definition. 

**Severity Definition:**
* Critical Defect
Blocks entire system's or module’s functionality
No workarounds available
Testing cannot proceed further without bug being fixed.

* High-severity Defect
Affects key functionality of an application
There's a workaround, but not obvious or easy
App behaves in a way that is strongly different from the one stated in the requirements

* Medium-severity Defect
A minor function does not behave in a way stated in the requirements.
Workaround is available and easy

* Low-severity Defect
Mostly related to an application’s UI
Doesn't need a workaround, because it doesn't impact functionality

## Definition of Done (Updated 2-23-21)
**Product Owner**
 - [ ]  Acceptance criteria have been met and validated on the Flexion Prod env

**UX**
 - [ ] Business test scenarios to meet all acceptance criteria have been written
 - [ ] Usability has been validated
 - [ ] Wiki has been updated (if applicable) 
 - [ ] Story has been tested on a mobile device (for external users only)
 - [ ] Add scenario to testing document, if applicable (https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA/edit?usp=sharing)

**Engineering**
 - [ ] Automated test scripts have been written
 - [ ] Field level and page level validation errors (front-end and server-side) integrated and functioning
 - [ ] Verify that language for docket record for internal users and external users is identical
 - [ ] New screens have been added to pa11y scripts
 - [ ] All new functionality verified to work with keyboard and macOS voiceover https://www.apple.com/voiceover/info/guide/_1124.html 
 - [ ] READMEs, other appropriate docs, JSDocs and swagger/APIs fully updated
 - [ ] UI should be touch optimized and responsive for external only (functions on supported mobile devices and optimized for screen sizes as required)
 - [ ] Module dependencies are up-to-date and are at the latest resolvable version (npm update)
 - [ ] Errors in Sonarcloud are fixed https://sonarcloud.io/organizations/flexion-github/projects
 - [ ] Lambdas include CloudWatch logging of users, inputs and outputs
 - [ ] Interactors should validate entities before calling persistence methods
 - [ ] Code refactored for clarity and to remove any known technical debt
 - [ ] Rebuild entity documentation
 - [ ] Acceptance criteria for the story has been met
 - [ ] Deployed to the dev environment
 - [ ] Deployed to the Court's migration environment

 **Review Steps**
 1. Finish all other DOD
 2. Deploy to the dev environment
 3. Engineers add `Needs UX Review` label
 4. UX Review on dev environment (if feedback, implement and go back to step 2)
 5. UX add `Needs Migration Deploy` label
 6. Deploy to the Court's migration environment
 7. Engineers go through test scenarios on Court's migration environment
 8. Engineers add `Needs PO Review` label and move to Review/QA column
 9. PO review (if feedback, implement and go back to step 2)
