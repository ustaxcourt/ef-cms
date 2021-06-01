[Return to Directory](./README.md)

## Service email
* Petitioners and practitioners are electronically served to the email they used during their CMS account creation

## Service preferences / indicator
* each party on a case has a service preference, including counsel: electronic, paper, or none

### Service indicator defaults
* When a Petitioner starts a case in paper, their service indicator should default to Paper
* When a Petitioner starts a case electronically, their service indicator should default to Electronic.
* When a Practitioner starts a case electronically, their service indicator should default to Electronic and the Taxpayer's service indicator should default to None.
* When a Practitioner starts a case in paper, their service indicator should default to Electronic (if they have an account) and Paper (if not) and the Taxpayer's service indicator should default to None.
* The service indicator for IRS attorneys should always default to Electronic.

### Editing service indicators
* Docket clerks are able to edit service indicators for parties
* Party service can be modified from electronic to paper, electronic to none, paper to none, or none to paper
* Party service cannot be modified from paper or none to electronic
* User will receive error message when trying to modify service to electronic from another method  

## Service of documents

### Externally Filed documents
* documents filed by a party should be served on the opposing party
* If an opposing party has electronic service, any e-filed document is automatically served electronically to the other party
* if an opposing party has paper service, it is the responsibility of the filing party to serve the document to the other party by mail and to provide a Certificate of Service, indicating that the other party was properly served
* If a document is filed by mail and manually added to the Docket Record, the document will be electronically served on complete of the docket entry

### Automatically Generated Notices
**Petitioner Address / Phone Changes**
* When a petitioner's address or phone number is changed, the system generates a Notice of Change of Address/ Notice of Change of Telephone Number/ Notice of Change of Address and Telephone Number
* Notice is automatically served to all electronic service parties
* If there is a party on the case who receives paper service, a work item is generated and displays in the Docket Section Document QC

**Docket Clerk updates address / phone number**
* When a petitioner's address or phone number is changed, the system generates a Notice of Change of Address/ Notice of Change of Telephone Number/ Notice of Change of Address and Telephone Number
* Notice is automatically served to all electronic service parties
* If there is a party on the case with paper service, the system displays modal prompting the clerk to print the document

**Notice of Docket Change**
* If there is a party on the case with paper service and a notice of docket change is generated, the system displays modal prompting the clerk to print the document when QC is complete

### Serving Court-Issued Documents (Orders, Notices, etc)
* When a court-issued document is served, the served date and filed date are populated on the docket record
* If there is a party on the case with paper service, the system displays modal prompting the clerk to print the document and directs user to the Print Paper Document
* Electronically served parties receive email service for court-issued document immediately when the document is served
