[Return to Directory](./README.md)

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

**Electronic**
* The received date is automatically time stamped and that date on the backend should be both received and the filed or lodged date.
* Received date and filed/lodged date both show up on the original cover sheet.
* If the user then edits the date on the docket record (this story), the filed date or lodged date updates on the backend and a new cover sheet is generated that has the original received date and the new filed or lodged date.

**Docket Record**
* date that shows on the docket record is the Filed Date (edited)
