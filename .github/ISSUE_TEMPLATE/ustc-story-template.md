---
name: DAWSON Story Template
about: Document stories for the DAWSON project
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


## Definition of Done (Updated 2026-01-28)

### Product Owner
 - [ ] Acceptance criteria have been met and validated on the Court's test environment.
 - [ ] Associated test cases defined in TestRail have been updated if necessary.
 - [ ] Successful test run is performed in TestRail.
 - [ ] User guides are updated if necessary.

### UX
 - [ ] All new functionality has been verified to work with keyboard navigation and screen reader software.
 - [ ] UI should be touch optimized and responsive for external users.

### Engineering
 - [ ] Automated test scripts have been written, including visual tests for newly added PDFs.
 - [ ] Successful test run is performed in TestRail.
 - [ ] New screens have been added to cypress accessibility axe.
 - [ ] Interactors should validate entities before calling persistence methods.
 - [ ] Types have been added to all added and updated functions.
 - [ ] Code refactored for clarity and to remove any known technical debt.
 - [ ] Acceptance criteria for the story has been met.
 - [ ] All schema changes are documented in the Data Dictionary (DD), and the Entity Relationship Diagram (ERD) is updated as appropriate.
 - [ ] If there are special deployment instructions, they have been added to the `CHANGES.md` file and the PR description.
 - [ ] Code that resides in the shared folder that only runs on the API or browser has been moved to either /web-client or /web-api.
