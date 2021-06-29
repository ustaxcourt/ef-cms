---
name: USTC Story Template
about: Document stories for the USTC project
title: ''
labels: ''
assignees: ''

---

## Pre-Conditions

## Acceptance Criteria

## Mobile Design/Considerations

## IRS API Considerations
Do these changes impact the IRS API?

## Security Considerations
 - [ ] Does this work make you nervous about privacy or security?
 - [ ] Does this work make major changes to the system?
 - [ ] Does this work implement new authentication or security controls?
 - [ ] Does this work create new methods of authentication, modify existing security controls, or explicitly implement any security or privacy features?


## Notes


## Tasks

## Definition of Done (Updated 4-14-21)
**Product Owner**
 - [ ]  Acceptance criteria have been met and validated on the Court's migration environment

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
 - [ ] Interactors should validate entities before calling persistence methods
 - [ ] Code refactored for clarity and to remove any known technical debt
 - [ ] Acceptance criteria for the story has been met
 - [ ] Deployed to any Flexion environment for UX Review
 - [ ] Deployed to the Court's migration environment
