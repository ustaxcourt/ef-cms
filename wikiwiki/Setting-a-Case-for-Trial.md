[Return to Directory](./README.md)

## Setting a Case for Trial
### QC of Eligible Cases
* Cases with the status of "General Docket (At Issue) - Ready for Trial" with no blocks or pending items, will be included in the list of Eligible Cases for an existing trial session in the requested trial location
* L and P case types get prioritized before any other type of case; and then sequentially based upon the date petition was filed (FIFO)
* Petitions/Calendar clerk must QC cases before they are set for trial and check the "QC Complete" checkbox on the trial session eligible case list
* When trial session is set (calendared) - eligible cases that have QC checked will be set for trial, in priority order, until they reach the max number of cases for that session

### Required Fields
Some fields are optional when creating a trial session but must be fulfilled to set the calendar:
* Judge
* Address, City, State, ZIP (for In Person Proceedings)
* Meeting ID, Password, Join by number, Chambers phone number (for Remote proceedings)


#### Bulk Generation of Notices
* When the trial session is set, all eligible cases added to that session are issued a Notice Setting Case for Trial and a Standing Pre-Trial Order (Regular cases) or Standing Pre-Trial Order for Small Case
* If any cases added include paper service, the clerk is directed to Print Paper Service documents; for printing purposes, the Notice Setting Case for Trial and Standing Pre-Trial Orders are combined for each case
* The Notice Setting Case for Trial displays on the Docket Record for each case added to the trial session
* The Standing Pre-Trial Order or Standing Pre-Trial Order for Small Case displays on the Docket Record for each case added to the trial session

### Manually Add a Case to an Open Trial Session
* User manually adds a case to a trial session that is already set
* Case appears in Open Cases, but does not impact any other cases on the trial session
* Can be added to a case in the requested trial location OR any trial location
* When added, a Notice Setting Case for Trial and a Standing Pre-Trial Order (Regular cases) or Standing Pre-Trial Notice (Small cases) is generated and add to the Docket Record
* A "Calendar Note" is optional when adding a case. This note displays on the Case Detail > Trial Information card, the Trial Session Detail screen, the Working Copy, and the Printable Trial Session PDF.

### Manually Add Case to a New Trial Session
* User selects which existing trial session they want the case to be added to
* Case is added with priority to the Eligible List for the selected trial session
* Can be added to a case in the requested trial location OR any trial location
* A "Calendar Note" is optional when adding a case. This note displays on the Case Detail > Trial Information card, the Trial Session Detail screen, the Working Copy, and the Printable Trial Session PDF.
* When the calendar is set for this trial session, this case will be set for trial, and a Notice Setting Case for Trial and a Standing Pre-Trial Order (Regular cases) or Standing Pre-Trial Notice (Small cases) is generated and add to the Docket Record

### Set Case as High Priority for Next Available New Trial Session
* Used to be called "white carding"
* User manually sets case as "high priority"
* If a trial session with status New exists for the requested trial location, case is added with priority to the Eligible List for the next available trial session
* If no trial session with status New exists for the requested trial location, case will be added to eligible case list when the trial session is created

### Set Case for Hearing
* Any case can be set for hearing, regardless of case status, or if there is a "Blocked from Trial" flag on the case
* Setting a case for hearing is completely separate from setting a case for trial, marking a case as high priority , or blocking a case from trial

* Cases can only be set for hearing on an Open trial session
* Adding a case for hearing does not change the case status or the associated judge. The case remains "Calendared" with the trial judge of the first session as the associated judge
* Other than the case status and judge, the case behaves the same way on the subsequent trial sessions as it does on the first trial session. Case appears on the Trial Session Detail and the Working Copy
* A "Calendar Note" is required when setting a case for hearing so the judge is aware why the case was added. This note displays on the Case Detail > Trial Information card, the Trial Session Detail screen, the Working Copy, and the Printable Trial Session PDF.

### Adding a Case to Trial that is blocked via Tracked Items or Manual Block

**Docket clerk adds case with tracked items to Open trial session**
* Deadline remains on case 
* Tracked item indicator displays 
* Case is added to the trial session and displays on trial session list
* Case status updates to Calendared 
* Blocked label no longer displays in header 
* Trial Information card now displays as Calendared 

**Docket clerk adds case with tracked items to New trial session** 
* Deadline remains on case 
* Tracked item indicator displays 
* Case is added to the trial session and displays on trial session list
* Case status does not change
* Blocked label no longer displays in header 
* Trial Information card now displays as Scheduled
 
**Docket clerk marks case with tracked items as High Priority** 
* Deadline remains on case 
* Tracked item indicator displays 
* Case is added to the eligible list for the next available trial session 
* Case status does not change
* Blocked label no longer displays in header 
* Trial Information card now displays as High Priority

**Docket clerk adds manual block to case with tracked items** 
* Trial card shows Blocked from Trial
* System block information does not display
* Blocked label remains in header
* Tracked item indicator remains in navigation
