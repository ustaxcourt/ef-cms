[Return to Directory](./README.md)

# Petitions QC
**Petitions QC Inbox**
  * Inbox - oldest to newest by Received date

**Petitions QC In Progress**
 * In Progress - to be added

**Petitions QC Served**
 * Served - newest to oldest by Served date


## Petition Links
**Section Document QC Inbox / My Document QC Inbox**
* On click of Petition document link, app navigates to Petition QC screen > Parties tab

**Section Document QC In Progress box / My Document QC In Progress box**
* On click of Petition document link, app navigates to Review and Serve Your Petition screen

**Section Document QC Served box/ My Document QC Served box**
* On click of Petition document link, app navigates to Petition Document Detail screen

**Petition link on Docket Record**
* On click of Petition document link from Docket Record, app navigates to the standard Document Detail screen for the Petition


## QC Icons
### Petitions
* If Unread - Bold with closed envelope icon
* If Unassigned - Yellow question mark


## QC Flow for Petitions
### Electronic petitions
* Petition is filed electronically, shows in Section Inbox and as unassigned
* Petition gets assigned to clerk, shows up in clerk’s Inbox, and in Section Inbox with clerk assigned

**Date received**
* if e-filed, date received displays read-only and is populated by date received into system

**Mailing date**
* If e-filed, mailing date field displays read-only and is populated with "Electronically filed"

**Trial location and Order Designating Place of Trial**
* If e-filed, trial location is displayed read-only and populated with user selection from Petition form
Order Designating Place of Trial checkbox is hidden

**Caption changes during QC**
If an update was made to the Case Caption field in Petition QC, or to the Primary and/or Secondary party names (automatically changing the case caption field) :

* Case caption is updated in Case Detail header
* Case title, where it displays in tables, Document QC queues, etc., is updated
* Docket entry is added to the docket record:
   * No. = next in sequence
   * Filed = Current date
   * EventCode = MINC
   * Filings and Proceedings = "Caption of case is amended from [old caption] to [new caption]"

**Docket number changes during QC**
If a change was made to the case type or case procedure resulting in a change to the docket number suffixL

* Docket number is updated in Case Detail header
* Docket number is updated where it appears in all tables, document queues, reports, etc.)
* Docket entry is added to the docket record:
  * No. = next in sequence
  * Filed = Current date
  * EventCode = MIND
  * Filings and Proceedings = "Docket number is amended from [old docket number] to [new docket number]"

#### Received Date and Filing Date
**Paper**
* When a court user is uploading a paper document, they're asked to put in a received date. That received date entered should be saved as both the received date and the filed date or lodged date, depending on what the user selects.
* Received date and filed date both show up on the cover sheet.
* If the user then edits the date on the docket record (this story), the filed date or lodged date updates on the backend and a new cover sheet is generated that has the original received date and the new filed or lodged date.

**Electronic**
* The received date is automatically time stamped and that date on the backend should be both received and the filed or lodged date.
* Received date and filed/lodged date both show up on the original cover sheet.
* If the user then edits the date on the docket record (this story), the filed date or lodged date updates on the backend and a new cover sheet is generated that has the original received date and the new filed or lodged date.

**Docket Record**
* Both paper and electronic - date that shows on the docket record is the Filed Date (edited)

# IRS Superuser
* after a Petition has been served, the case is automatically associated to the IRS Superuser role
* IRS Superuser role has full access to all cases within the system
* IRS Superuser does not display as Respondent Counsel in any associated cases
