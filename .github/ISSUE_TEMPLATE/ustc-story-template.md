---
name: USTC Story Template
about: Document stories for the USTC project
title: ''
labels: ''
assignees: ''

---

As a _______, so that ________, I need ________.


## Pre-Conditions

## Acceptance Criteria


## Notes


## Tasks

## Test Cases


## Story Definition of Ready (Created on 9/26/21)
The following criteria must be met in order for the user story to be picked up by the Flexion development team.
The user story must: 
- [ ]  Be immediately actionable for the development team
- [ ]  Be focused on users
- [ ]  Include a narrative. “As a ____, so that I can ______, I need _____.”
- [ ]  Include user-centric acceptance criteria that expresses the users' needs
- [ ]  Include user-centric testing scenarios
- [ ]  Include preconditions (story dependencies)
- [ ]  Not include design or technical solutions
- [ ]  Include non-standard testing, deployment, documentation, browser, mobile or security requirements, as well as any requirements for 3rd-party integrations

Process: Flexion developers and designers will test if the story meets acceptance criteria and test cases in Flexion dev and staging environments (“standard testing”). If additional acceptance criteria or testing scenarios are discovered while the story is in progress, a new story should be created, added to the backlog and prioritized by the product owner. 

## Definition of Done (Updated 10-6-21)
**Product Owner**
 - [ ]  Acceptance criteria have been met and validated on the Court's migration environment
 - [ ] Add scenario to testing document, if applicable (https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA/edit?usp=sharing)

**UX**
 - [ ] Business test scenarios have been refined to meet all acceptance criteria 
 - [ ] Usability has been validated
 - [ ] Wiki has been updated (if applicable) 
 - [ ] Story has been tested on a mobile device (for external users only)

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
 - [ ] If there are special instructions in order to deploy into the next environment, add them as a comment in the story
 - [ ] Deployed to any Flexion environment for UX Review
 - [ ] Deployed to the Court's migration environment
