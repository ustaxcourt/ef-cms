# Postgres Implementation Plan

## Update Persistence Gateway

### Goal
Replace existing persistence gateway functions with new kysely functions.

### Method

#### 1. DevEx / OpEx

How to divide resources (feature deployment needs to continue)?
  - Court dev team assistance
  - Allocate additional flexion resources

Division of Work if DevEx / OpEx:
- Single Function/Entity
- Group by Related Functions/Entities

#### 2. Story by story

Court would like to avoid this as it combines work thus:
- Harder to track
- Shorter stories become longer stories 
- Increased test requirements

#### 3. Other options
...

.....

.......

### Process
- Create table & relations (ex: message.docketNumber = case.docketNumber) if doesn't exist (via migration process, see docs/postgres/migrations.md)
- Seed necessary data from web-api/storage/fixtures/seed/efcms-local.json and/or web-api/storage/fixtures/seed/users.json
- Move into postgres folder 
`web-api/src/persistence/postgres/<pluralObject>/<existingFunctionName.ts>`
- Delete existing persistence unit test (as these don't serve much benefit)
- Create mapper/picker (optional but more dry)
`web-api/src/persistence/postgres/<pluralObject>/mapper.ts`
- Update to kysely function (using ChatGPT, based off existing examples, or see kysely documentation)
- Remove applicationContext from function if possible
- Import function directly where used
- Create mock factories 
`web-api/src/persistence/postgres/<pluralObject>/mocks.jest.ts`
- Ensure existing tests pass
  - Update mocked functions for direct import


### DynamoDB Functions

Found in `web-api/src/persistence/dynamo/**/*.ts`

#### Replace w/ Postgres
- Case Deadlines
- Cases
- Case Worksheet
- Correspondence
- Docket Entries (Documents)
- Pending Motion
- Practitioners
- Trial Sessions
- User Case Notes
- Users
- Work Items

#### Keep for now
- DeployTable
- Notifications
- Polling

#### Unknown function
- Helpers
- Jobs
- Locks

### DynamoDB Entities
- Case
- Docket Entry
- User
- Work Item
- Practitioner
- Hearing
- ...
- .....


### OpenSearch Functions

Found in `web-api/src/persistence/elasticsearch/**/*.ts`

#### Replace w/ Postgres
- Reports (Cold Cases)
- Users 
- Practitioners
- Work Items

#### Keep for now
- Advanced Document Search
- Cases including deadlines
- Docket Entries

#### Unknown function
- Helpers

### OpenSearch Entities
- Case Deadline
- Case
- Docket Entry
- User
- Work Item

## Next steps
- Work Items (Logical progression from Messages)
- User Case Notes (Low Lift)
- Trial Sessions and Hearings
- Cases, Docket Entries (Documents), Correspondence, and Pending Motions
- Users and Practitioners

