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

## Definition of Ready for Bugs(Created 10-4-21)
Definition used: A failure or flaw in the system which produces an incorrect or undesired result that deviates from the expected result or behavior. (Note: Expected results are use cases that have been documented in past user stories as acceptance criteria and test cases, and do not include strange behavior unrelated to use cases.)

The following criteria must be met in order for the development team to begin work on the bug.

The bug must:
 - Be focused on solving a user problem
 - Contain data for all fields in the bug template, so the team can pick it up and begin working immediately

Process: If the unexpected results are new use cases that have been identified, but not yet built, new acceptance criteria and test cases should be captured in a new user story and prioritized by the product owner. 

If the Court is not able to reproduce the bug, add the “Unable to reproduce” tag. This will provide visibility into the type of support that may be needed by the Court. In the event that the Court cannot reproduce the bug, the Court will work with Flexion to communicate what type of troubleshooting help may be needed.

## Definition of Done (Updated 4-14-21)
**Product Owner**
 - [ ]  Bug fix has been validated in the Court's test environment

**Engineering**
 - [ ] Automated test scripts have been written
 - [ ] Field level and page level validation errors (front-end and server-side) integrated and functioning
 - [ ] Verify that language for docket record for internal users and external users is identical
 - [ ] New screens have been added to pa11y scripts
 - [ ] All new functionality verified to work with keyboard and macOS voiceover https://www.apple.com/voiceover/info/guide/_1124.html 
 - [ ] READMEs, other appropriate docs and swagger/APIs fully updated
 - [ ] UI should be touch optimized and responsive for external only (functions on supported mobile devices and optimized for screen sizes as required)
 - [ ] Interactors should validate entities before calling persistence methods
 - [ ] Code refactored for clarity and to remove any known technical debt
 - [ ] Deployed to the Court's `test` environment if prod-like data is required. Otherwise, deployed to any `experimental` environment for review.
