[Return to Directory](./README.md)

## Edit Docket Entries - (Docket Clerk Only)
* A docket clerk has the ability to update the docket record with/without adding a change of docket entry addition
* After QC is complete for an entry, an edit link displays at the far right of the docket record table
* When the Docket clerk clicks on the edit link on a document the Edit Docket Entry screen displays

### Edit Docket Entry screen
* Includes 3 tabs: Document Info, Service, Actions

#### Document Info
* If document name, COS, Filed vs Lodged are changed, and/or add additional information 1 is added a Notice of Docket Change is added to the docket record and a new coversheet is created to go on top of the old coversheet on the updated document
* When other changes are made no change of docket record is issued but original coversheet is updated as needed

**Who is Filing this Document**
* If "Other" is checked, "Other filing party name" field displays
* any existing data from QC or Add Docket Entry should be displayed in fields
* On save, updates to Filed By should display on docket entry and a Notice of Docket Change is not generated when updated from this flow

#### Service
* Allows Docket Clerk to update the parties served

#### Actions
* Allows Docket Clerk to add free text to the "Action" column on the Docket Record
* The Action column is used to display the resulting action on a document (Granted, Denied, etc.) and the associated document communicating that action (ORD MM/DD/YY)

#### Add to Pending Report
Docket clerk can mark something as pending after it's been processed

After the item is marked as pending it has all the same logic as any other pending item:
* It shows up on pending tab in the case
* It shows up on the pending report of the associated judge
* It blocks a case from being eligible for trial
* It can be removed as pending

If the case is Calendared, Scheduled for Trial, or marked High Priority:
* the item displays on Pending Report on the case
* the item displays on Pending Report on the judge's Pending Report
* the case remains on the trial session or with high priority status
* the case does not get blocked unless it is removed from the trial session or removed from high priority
