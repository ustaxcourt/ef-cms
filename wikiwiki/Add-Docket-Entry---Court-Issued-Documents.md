[Return to Directory](./README.md)

## Add Docket Entry (Court-Issued Documents)
**On click of "Add Docket Entry" button**

* Navigate to new "Add Docket Entry" screen for court-issued documents
* Order PDF is displays in PDF viewer

**Docket Entry Preview**
* Docket Entry Preview displays with real-time preview of the docket entry (filings and proceedings) text
* Display concatenated docket entry dynamically as user enters text
* display (Attachment(s)) if checkbox is selected
* Display up to two lines of text, then truncate

**Document Type**
* Type ahead dropdown selector
* Field is populated with the original order code (what the user selected when creating the order)
* Dropdown list contains all document types listed in https://docs.google.com/spreadsheets/d/1et69WCFOlanKsO56Kd7MeP18tw162ZrtTW48SVy-QBE/edit?usp=sharing
* Additional fields are displayed based on the document type

**Inclusions**
* Display Attachments checkbox for all document types
* If checked, (Attachment(s)) is appended to the concatenated document title in the docket record
format [Concatenated Document title] (Attachment(s))

**Service Parties**
* Display all parties on the case
* Display service preference for each party

### Orders
* Orders and Decisions must have a signature applied before a docket entry can be created. "Add Docket Entry" option will be hidden until the order/decision is signed by a judge

### On Save of Docket Entry
* User is navigated back to Case Detail page with success message "Your entry has been added to the docket record."
* Document no longer displays in Draft Documents tab
* Incomplete Docket Entry displays on Docket Record for internal and external users
* Filed date on incomplete entry is blank
* Document displays in the "In Progress" tab on the Individual and Section Document QC

**Docket Clerk /Clerk of the Court role clicks on incomplete docket entry (saved court-issued document) link**
* Navigate to "Edit Docket Entry screen
* Alert message displays on the "Edit Docket Entry" screen

**Other Internal User clicks on incomplete docket entry (saved court-issued document) link**
* Navigate to Document Detail page for saved court-issued document
* Display current document in PDF
* Display concatenated document title as page title
* Do not display a "filed by"
* Do not display "Edit" button

### Unserved Court-Issued documents
These documents are court-issued but are not served onto parties when added to the docket record
* Hearing Exhibits for [Anything]
* Trial Exhibits for [Anything]
* Transcript of [Anything]
* Further Trial before [Judge] at [Place]
* Corrected Transcript of [Date]
* Hearing before [Judge] at [Place]
* Partial Trial before [Judge] at [Place]
* Trial before [Judge] at [Place]
* Revised Transcript of [anything]

### Court-Issued Documents with a Cover Sheet
These documents receive a system generated cover sheet when added to the docket record
* Hearing Exhibits for [Anything]
* Trial Exhibits for [Anything]
* Bounced Electronic Service of [Anything]
* Returned Mail of [Anything]
* U.S.C.A [Anything]
