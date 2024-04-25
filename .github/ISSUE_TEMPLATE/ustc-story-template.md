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


## Definition of Done (Updated 01-16-24)
**Product Owner**
 - [ ] Acceptance criteria have been met and validated on the Court's test environment
 - [ ] Add scenario to testing document, if applicable (https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA/edit?usp=sharing)

**Engineering**
 - [ ] Automated test scripts have been written, including visual tests for newly added PDFs.
 - [ ] Field level and page level validation errors (front-end and server-side) integrated and functioning.
 - [ ] New screens have been added to pa11y scripts.
 - [ ] All new functionality verified to work with keyboard and macOS voiceover https://www.apple.com/voiceover/info/guide/_1124.html.
 - [ ] Swagger docs have been updated if API endpoints have been added or updated.
 - [ ] UI should be touch optimized and responsive for external users.
 - [ ] Interactors should validate entities before calling persistence methods.
 - [ ] Features have been optimized where possible to reduce response times. For example, reducing api response times, parallelizing client network calls, optimizing database reads, etc.
 - [ ] Types have been added to all added and updated functions.
 - [ ] Code refactored for clarity and to remove any known technical debt.
 - [ ] Acceptance criteria for the story has been met.
 - [ ] If there are special instructions in order to deploy into the next environment, add them as a comment in the story.
 - [ ] Code that resides in the shared folder that only runs on the API or browser has been moved to either /web-client or /web-api.
