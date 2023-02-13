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

## Story Definition of Ready (updated on 12/23/22)
The following criteria must be met in order for the user story to be picked up by the Flexion development team.
The user story must: 
- [ ] Is framed in business/user need, the value has been addressed.
- [ ] Includes acceptance criteria
- [ ] Has been refined
- [ ] Pre conditions have been satisfied. 

**Process:** 
Flexion developers and designers will test if the story meets acceptance criteria and test cases in Flexion dev and staging environments (“standard testing”). If additional acceptance criteria or testing scenarios are discovered while the story is in progress, a new story should be created, added to the backlog and prioritized by the product owner. 


## Definition of Done (Updated 5-19-22)
**Product Owner**
 - [ ]  Acceptance criteria have been met and validated on the Court's migration environment
 - [ ] Add scenario to testing document, if applicable (https://docs.google.com/spreadsheets/d/1FUHKC_YrT-PosaWD5gRVmsDzI1HS_U-8CyMIb-qX9EA/edit?usp=sharing)

**UX**
 - [ ] Business test scenarios have been refined to meet all acceptance criteria 
 - [ ] Usability has been validated
 - [ ] Wiki has been updated (if applicable) 
 - [ ] Story has been tested on a mobile device (for external users only)

**Engineering**
 - [ ] Automated test scripts have been written, including visual tests for newly added PDFs.
 - [ ] Field level and page level validation errors (front-end and server-side) integrated and functioning.
 - [ ] Verify that language for docket record for internal users and external users is identical.
 - [ ] New screens have been added to pa11y scripts.
 - [ ] All new functionality verified to work with keyboard and macOS voiceover https://www.apple.com/voiceover/info/guide/_1124.html.
 - [ ] READMEs, other appropriate docs, JSDocs and swagger/APIs fully updated.
 - [ ] UI should be touch optimized and responsive for external only (functions on supported mobile devices and optimized for screen sizes as required).
 - [ ] Interactors should validate entities before calling persistence methods.
 - [ ] Code refactored for clarity and to remove any known technical debt.
 - [ ] If new docket entries have been added as seed data to `efcms-local.json`, 3 local s3 files corresponding to that docketEntryId have been added to `web-api/storage/fixtures/s3/noop-documents-local-us-east-1`
 - [ ] Acceptance criteria for the story has been met.
 - [ ] If there are special instructions in order to deploy into the next environment, add them as a comment in the story.
 - [ ] If the work completed for the story requires a reindex without a migration, or any other special deploy steps, apply these changes to the following flexion branches:
   - [ ] experimental1
   - [ ] experimental2
   - [ ] experimental3
   - [ ] experimental4
   - [ ] experimental5
   - [ ] experimental6
   - [ ] develop
 - [ ] Reviewed by UX on a deployed environment.
 - [ ] Reviewed by PO on a deployed environment. Can be deployed to the Court's `test` environment if prod-like data is required. Otherwise deployed to any `experimental` environment.
 - [ ] Deployed to the Court's `staging` environment.

