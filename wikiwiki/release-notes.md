# Release Notes

## PR 62 Release Notes

### Internal Only
**Improvement** Admissions Clerks can change an existing practitioner’s email in DAWSON. This will reflect in all of their cases and be used for login and service.

**Bug Fix** The Processed and Served boxes for Docket and Petitions now show items completed within the last 7 days, sorted newest to oldest.


### External / Public
**Improvement** Petitioners and practitioners can change the email used for login and service through their DAWSON account.

**Improvement** Bench Opinions now display in the Today’s Opinions list.

**Bug Fix** Document title did not display when attaching a draft document to a message.
* When selecting a draft document to attach to a message, the full document title now displays in the dropdown.

**Bug Fix** Users were being logged out when drafting orders using multiple tabs.
* When working in multiple tabs, you will not be logged out until there is inactivity in all tabs.

**Bug Fix** Petitioner service now displays accurate service preference for IRS attorneys before they are associated with the case.

## PR 61 Release Notes

### Internal
**Improvement**: Admissions clerks can edit the profile for a practitioner without an email address.
* Clerks can make changes to practitioner information for practitioners with or without an email address on record.

**Bug Fix**: Docket clerks will not be prompted to print paper service after completing QC and sending a message.
* When completing QC and sending a message for a document to be served via paper service, clerks are now prompted immediately to print and mail the necessary documents.

**Bug Fix**: Document titles will now display correctly across the application
* Document titles were missing any “additional info” text when attaching a document to a message. The full document title now displays in the dropdown to attach a document.
* Updates to the document title during the QC process were not being reflected when sending a message or being updated accurately on the Docket Record. Any updates made to a document title during the QC process reflect immediately on messages and on the Docket Record.

**Bug Fix**: Electronic signatures are now visible in all PDF previews
*  Some PDF previews were not properly displaying electronic signatures on documents. Documents uploaded to the system with electronic signatures now display the signature in all PDF previews
* Parties filing documents on mobile devices do not have access to PDF previews prior to submitting their documents.

**Bug Fix**: Errors when clicking on messages has been resolved
* Some users were encountering a white screen when clicking on their messages, which required to refresh to view the message. Users are now able to access their messages without refresh directly from their inboxes.   

**Bug Fix**: Completed messages will no longer display in any inbox or In Progress queue
* Completed messages were still displaying in the section Inbox and in the In Progress tab on the case.
* When a message is completed, it is no longer display in any individual or section Inboxes, or in the In Progress tab under Case Messages. Completed messages will display in the Completed tabs.

**Bug Fix**: Public docket record now displays accurate event codes and filings and proceedings
* The public view of the Docket Record was displaying an incorrect event code for lodged documents. All lodged documents now show on the Docket Record with the correct event code of MISCL.
* The public view of the Docket Record was not displaying the complete entry text under Filings and Proceedings. Parenthetical text (i.e. Attachments, Certificate of Service, Objections) now display as part of the Filings and Proceedings for all views of the Docket Record.

### External / Public  
**Bug Fix**: Electronic signatures are now visible in all PDF previews
*  Some PDF previews were not properly displaying electronic signatures on documents. Documents uploaded to the system with electronic signatures now display the signature in all PDF previews
* Parties filing documents on mobile devices do not have access to PDF previews prior to submitting their documents.

**Bug Fix**: Public docket record now displays accurate event codes and filings and proceedings
* The public view of the Docket Record was displaying an incorrect event code for lodged documents. All lodged documents now show on the Docket Record with the correct event code of MISCL.
* The public view of the Docket Record was not displaying the complete entry text under Filings and Proceedings. Parenthetical text (i.e. Attachments, Certificate of Service, Objections) now display as part of the Filings and Proceedings for all views of the Docket Record.


## PR 60 Release Notes
### Internal

**Improvement**: Practitioners without an email address on record will default to paper service
* Migrated practitioners without an email address will have paper service for all of their associated cases

**Bug Fix**: Character limits on fields were not throwing validation errors
* Message input fields can now accept up to 700 characters, and will show a helpful error message when the limit is reached.
* Document free text fields can now accept up to 1000 characters, and will show a helpful error message when the limit is reached.
* The complete document title now accepts up to 3000 characters total, and will inform the user when the limit is reached.

**Bug Fix**: Several fixes were made to the Edit Docket Entry feature
* All data entered when adding a docket entry is now retained on the Edit Docket Entry screen
* All required fields are now displayed when updating a document type on the Edit Docket Entry screen
* A cover sheet is now being applied when a docket entry is updated to event codes HE, TE, USCA, RM, ES
* Some migrated docket entries were causing an error when accessing the Edit Docket Entry screen. The undefined values have been identified and will no longer produce an error.

**Bug Fix**: Completed messages were still showing in user Inboxes
* When a message is completed, it is now removed from all users’ inboxes, regardless of who completed it.

**Bug Fix**: Service stamps were displaying vertically on rotated PDFs
* Service stamps and signatures that were displaying vertically when applied to PDFs will now display horizontally only.

**Bug Fix**: Pretrial Memorandums are no longer accessible by the public
* Some Pretrial Memorandum docket entries were hyperlinked for public users, and the PDF document was visible. Public users and those not associated with a case no longer can view a Pretrial Memorandum.

**Bug Fix**: Alignment corrected on Today’s Orders
* Order titles that expand to multiple lines on the Today’s Orders table are now left-aligned.  

**Bug Fix**: MISCL event code is no longer an option when adding a paper-filing
* The MISCL code has been removed from the document type dropdown. The code will be automatically applied when MISC is selected as the document type and the filing status is “Lodged”


### External / public

**Bug Fix**: Pretrial Memorandums PDFs were accessible to the public
* Some Pretrial Memorandum docket entries were hyperlinked for public users, and the PDF document was accessible. This document type is now not accessible to the public.

**Bug Fix**: Order title on Today’s Orders table was not left-aligned
* Order titles that expand to multiple lines on the Today’s Orders table are now left-aligned.  

**Bug Fix**: Character limits on fields were not throwing validation errors
* Document free text fields can now accept up to 1000 characters, and will show a helpful error message when the limit is reached.
* The complete document title now accepts up to 3000 characters total, and will inform the user when the limit is reached.



## PR 59
### Internal

**New Feature**: Remote Proceedings for Trial Sessions
Internal users can:
* Select from either in-person or remote trial proceedings
* Enter and view details specific to remote proceedings
* View updated content for the Notice Setting Case for Trial, Standing Pretrial Order, and Standing Pretrial Order for Small Case with information specific to remote proceedings.

**Improvement**: IRS practitioner role can now view case information before being associated with a case
* IRS practitioners now have access to view all case information, including petitioner contact information, before being associated with a case.
* Information in sealed cases are still not visible to IRS practitioners not associated with the case.
* Sealed addresses are not visible to IRS practitioners, whether associated or not associated to the case.

**Bug Fix**: Cover sheets are applied and page count is now accurate for e-Filed documents
* We’ve fixed the issue with cover sheets not being applied to all e-Filed documents, and the page count on the Docket Record was wrong.


### External/Public

**New Feature**: Remote Proceedings for Trial Sessions
External users can:
* View updated content for the Notice Setting Case for Trial, Standing Pretrial Order, and Standing Pretrial Order for Small Case with information specific to remote proceedings.

**Improvement**: IRS practitioner role can now view case information before being associated with a case
* IRS practitioners now have access to view all case information, including petitioner contact information, before being associated with a case.
* Information in sealed cases are still not visible to IRS practitioners not associated with the case.
* Sealed addresses are not visible to IRS practitioners, whether associated or not associated to the case.

**Bug Fix**: Cover sheets are applied and page count is now accurate for e-Filed documents
* We’ve fixed the issue with cover sheets not being applied to all e-Filed documents, and the page count on the Docket Record was wrong.


## PR 58
* Implement posting of Today's Orders
* Improve ​mo​bile scrolling for Printable ​Docket Record
* Allow petitioner names with ​special characters (​') in case search
* Improve mobile viewing of PDFs on the “Review Your Case” screen
