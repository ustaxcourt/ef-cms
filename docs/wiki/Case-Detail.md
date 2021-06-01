[Return to Directory](./README.md)

## Case Header
**Docket number**
* Do not display leading zeros in docket number or URL
* Searching docket number does not require leading zeros

**Case Caption**
* When case is created, the case caption is automatically generated based on party type and party contact information
* Upon case creation, the link between party type and contact info and the case caption is broken and the caption must be manually edited from the Case Detail or Document Detail pages - changing the party type will no longer update the caption

**Case Statuses**
* External users (petitioner, practitioner, IRS attorney) should never see cases statuses
* Full list of case statuses can be found here https://docs.google.com/document/d/1qhxASEKuzcPp99rTfCVkYbi6hVKS1pPPIgn5MvEWFPM/edit?usp=sharin

**Assigned Judge**
* Case is assigned to a judge at all times
* New,General Docket (Not At Issue), General Docket - At Issue- Ready for Trial cases are assigned to the Chief Judge
* Other case statuses are assigned to a selected judge
* The assigned judge and the trial session judge do not have to be same (although they normally will be)
* Chief Judge role is not tied to a user login - a judge acting in the Chief Judge capacity can have cases assigned to them as their judge user login and have cases assigned to the Chief Judge role

### Case Detail Menu
**New Tab**
* On click of New Tab, a new browser tab opens with Case Detail > Docket Record of the current case

**Message**
* On click, displays Create New Message modal

**Deadline**
* On click, displays Add Deadline modal

**Order or Notice**
* on click, displays Create Order or Notice modal

**Paper Filing**
* on click, navigates to Add Paper Filing screen

**PDF Upload**
* On click, navigates to Upload PDF screen

**Correspondence**
* on click, navigates to Add Correspondence scren

**Add Case Note**
* on click, displays Add Case Note modal

## Docket Record
* [Docket Record](https://github.com/flexion/ef-cms/wiki/Docket-Record) is the official record for the case, and is visible to all users, including the public (with limited permissions)

## Deadlines
* Displays all current deadlines on the case

## In Progress
#### Draft Documents
* [Drafts](./Drafts.md) include court-issued documents that have been saved but not added to the Docket Record


#### Pending Messages
* All active messages related to documents on a case are displayed under pending messages
* When a message is completed, it is removed from the Pending Messages table

#### Pending Report
* All documents tracked on the Pending Report for a case are displayed under pending report
* Pending Report documents for a single case can also be printed in a print-optimized PDF

#### Petition Details
* Docket Clerks / Clerk of the Court role is able to edit petition details from the Case Detail screen
* Docket Clerks / Clerk of the Court role is able to seal a case (See [Sealed Cases](Sealed-Cases.md))

#### Trial information
* Displays the current trial status of the case:
  * Not Scheduled - case is not on any trial session and has not been marked as High Priority
  * Not Scheduled High Priority - case is marked as High Priority and is on the eligible list for a trial session that has not been set
  * Scheduled - case has been manually added to the eligible list for a trial session that has not yet been set
  * Calendared - case is on a trial session that has been set
  * Blocked from Trial - case has either a manual block, a system-generated block or both and cannot be set for trial or set as high priority

## Notes
**Case Notes**
* Case notes can be added/edited/deleted/viewed by all internal users
* These are procedural notes related to the case

**Judge's Notes**
* Judge's notes are visible only to the Judge who created the notes and their chambers
