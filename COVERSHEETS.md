Coversheet functionality
Party eFiles a document 
Coversheet is added to every party efiled document
For simultaneous docs, no service stamp
For all docs besides simultaneous, coversheet includes service stamp
Document QC - eService parties only
Docket Clerk completes QC on eFiled doc without any document metadata edits - no changes to original coversheet
"Docket Clerk completes QC on eFiled doc with edits to the document metadata new coversheet is appended to the front of the document (original coversheet still exists) Document Type, Additional info 1 (with the ""add to coversheet checkbox checked), Certificate of Service

Edits made to the following do NOT generate a new coversheet:  Filed -> Lodged, Additional info 1 (w/o checking add to coversheet), Additional info 2, Attachments, Filed by, or add to pending report  

Note: Edits made to the filed date will generate a new coversheet, but no data actually gets updated on the coversheet or on the docket record. (for example, filed date is 5/15/26, during QC, edit the filed date to 5/11/25. New coversheet generated, but it doesn't actually display any difference in filed date, and keeps the Original filed date of 5/15 on both the coversheet AND the docket record"
Document QC - Paper Service parties
Docket Clerk adds a paper filing, serves document - no coversheet is added to the print for paper service, but a coversheet IS added to the document on the docket record.
Docket Clerk adds a paper filing, saves for later, then navigates back to the document to serves it at a later time - no coversheet is added to the print for paper service doc, but a coversheet IS added to the document on the docket record.
Edit Docket Entry
"Docket Clerk edits an existing document on the docket record. Makes edits to the document metadata on the Document Info tab, new coversheet is appended to the front of the document (original coversheet still exists): Filed Date, Document Type, Additional info 1 (with checkbox to add to coversheet checked), and Certificate of Service

Edits made to the following do NOT generate a new coversheet: Filed -> Lodged, Additional info 1 (w/o checking add to coversheet), Additional info 2, Attachments, edits to the certificate of service date,  filed by, objections (for motions), or add to pending report)  -  

Note: edits made to the Service or Actions(s) tab do not generate a new coversheet.

BUG: Steps to recreate (I'm not going to input this on the board yet...we may need to overhaul coversheets all-together)
- Edit a docket entry from filed to lodged - no new coversheet generated
- Next edit the docket entry again, this time change the filed date (5/15 to 5/11) - filed date changes, new coversheet generated with new date, and the coversheet reflects now that the doc is lodged (from the first edit)
- Edit the docket entry again, this time add in additional info 1 and check the box to add to cover sheet - new coversheet is generated, but this time the Received date has reverted back to the original date, instead of the date you input from the second step"
Service of Simultaneous docs
Docket Clerk serves an eFiled simultaneous document - new coversheet is appended to the front of the doc (original coversheet still exists). The coverheet is the same, but a service stamp is added.
Docket clerk serves a paper filed simultaneous document - coversheet is added to the front of the document on the docket record (includes the service stamp), but the print for paper service page does not include a coversheet.
Docket clerk saves a paper filed simultaneous document for later. Clicks on the document from the docket record and serves - coversheet is added to the front of the document on the docket record (includes the service stamp), AND  the print for paper service page includes a coversheet.
Court Issued documents with Coversheet
Docket clerk adds a Court issued document that has a coversheet (ex: Returned Mail, U.S.C.A, etc.) and saves it to the docket record - coversheet generated
Docket clerk adds a Court issued document that has a coversheet (ex: Returned Mail) and saves it to the docket record - coversheet generated, Docket clerk then edits the document to a different Court issued doc that has a coversheet (ex: U.S.C.A), new coversheet is appended to the front of the doc (original coversheet still exists)
Docket clerk adds a Court issued document that has a coversheet (ex: Returned Mail, U.S.C.A, etc.) and saves it to the docket record - coversheet generated, Docket clerk edits the document and changes the document type to a Court document that does NOT have a coversheet - coversheet is removed and document is served.
Docket clerk adds a Court issued document that does NOT have a coversheet (ex: Opinion) and saves or serves it to the docket record (no coversheet). Docket clerk then edits the document and changes the document type to a Court issued document that has  a coversheet - coversheet is added to the document.
Consolidated filings
"Pre-8477 - Simultaneous - Party eFiles a simultaneous doc across a group, Docket QC's each indivdual filing, singular coversheet upon QC. When Docket Clerk serves the simultaneous doc, they must serve it in each individual case. Upon service in each case, a new coversheet is appended to the original doc.  For each case they serve the document in, a new coversheet is appended each time. 

Note: This will be resolved with 8477, and the document will only have two coversheets, the original and the new appended one with the service stamp."
"Pre-8477 - Party eFiles a doc across a group, Docket QC's each indivdual filing and each filing needs an update to the metadata, they must QC it in each individual case. Upon QC in each case, a new coversheet is appended to the original doc.  For each case they QC the document in, a new coversheet is appended each time. 

Note: This will be resolved with 8477, and the document will only have two coversheets, the original and the new appended one with the service stamp."