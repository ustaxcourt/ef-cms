## Drafts

Drafts include:
* internally created Orders, Notice, and Decisions created in the system and not added to the Docket Record
* Documents added through the "Upload PDF" feature that have not been added to the Docket Record

### List of Draft documents (left panel)
* Display all draft documents sorted by Created date (oldest to newest)
* Displays [Document Title] and Created by [User name who created the draft]
* the first (oldest) draft should be selected

### Draft PDF (right panel)
* PDF viewer displays selected draft document PDF
* On select of another draft document from left panel, PDF viewer updates to display selected document

#### Draft Document Actions
**Edit**
* On click, navigates to "Edit Order" screen (if document has already been signed, displays "Editing. this document will remove signature" modal, and then navigate to Edit Order screen)
on click of "Save" on Edit Order screen, app navigates to Apply Signature screen

**Delete**
* On click of Delete, display "Are you sure you want to delete this document?" modal
* On "Yes", modal closes and page refreshes with success message displayed and deleted draft document removed from list

**Apply Signature**
* Action displays if the document has not yet been signed
* On click of Apply Signature, app navigates to Apply Signature screen
* On click of "Skip Signature", app navigates back to Draft Document View with success message displayed:"[Order/Notice title] updated."
* On click of "Save Signature", app navigates back to Draft Document View with success message displayed: "[Order/Notice title] updated."

**Remove Signature**
* Action displays if the document has been signed
* On click of Remove Signature, display Remove Signature warning modal
* on click of "Yes, Remove" button on modal:
  * Signature is removed from PDF
  * "Apply Signature" link is displayed in PDF actions toolbar
  * "Remove Signature link is hidden in PDF actions toolbar


**View Full PDF**
* On click, selected PDF displays in new tab

#### Add Docket Entry (Displays only for Docket/Petitions/Clerk of the Court)**
**Unsigned Draft that does not required signature**
* On click, navigate to Add Court-Issued Docket Entry screen
* On click of cancel from Add Court-Issued Docket Entry screen, navigate to Drafts Document View
* On click of "Save Entry" or "Save and Serve" from Add Court Issued Docket Entry screen, navigate to Docket record with success message displayed

**Unsigned Draft that requires signature**
* Add Docket Entry option is hidden
* Message displays "Signature is required for this document"
