[Return to Directory](./README.md)

# Add Docket Entries - External Paper Filings
See [Add Docket Entry - Externally Filed Paper Document User Flow ](https://www.lucidchart.com/invitations/accept/274f4958-92c5-4d5f-9e20-b75ef92ba74a)

* Parties may still mail in paper documents to be filed manually by a docket clerk
* Docket Clerks can access the Add Docket Entry screen from the Actions menu

### Scan or Upload
* Clerks have the option to upload a PDF or to scan documents directly from their desk scanner
* scanner settings include single-sided, two-sided, and flatbed

**Remove PDF**
* Docket clerk can remove a paper filing PDF any time before serving the document
* After service, PDFs cannot be removed


### Add Docket Entry Form
**Filing Status**
* Filed - default selection, document will display as "Filed" on docket record
* Lodged - used for documents that require approval by a judge to be admitted to the record; the docket entry will automatically be appended with LODGED

**Date received**
* is displayed on the cover sheet
* is also used as the Filing Date

**Mailing date**
* optional text field
* is displayed on the cover sheet

**Document type**
* Document type select component - user can enter in the event code or document title; matching event codes should be listed first in results
* On select of a nonstandard document type, additional required fields will display; these fields are needed to concatenate the full document title on the Docket Record

* Additional Info Line 1**
* entered text is added to the filings and proceedings on the docket entry
* If "Add to Coversheet" is checked, this text is also added to the Document Title on the cover sheet

**Additional Info line 2**
* * entered text is added to the filings and proceedings on the docket entry

**Inclusions**
* selections are added to the filings and proceedings on the docket entry
* Certificate of Service, if selected, is also added to the cover sheet

**Who is filing**
* is the party who filed the document, may be one or more
* Displays in the Filed By column on the docket record

**Tracking**
* If checked, document is added to the pending report until manually removed
* Motions, Applications, Order to Show Cause, and Proposed Stipulated Decisions are automatically added to pending report and this checkbox is hidden

**On Save Entry**
* app navigates to Case Detail > Docket record with success message
* New docket entry is added to docket record as "not served"
* Document displays in the Docket Document QC > In Progress queue until it is served

**Save and Serve**
* Service confirmation modal Displays
* On serve, the docket entry is added to docket record with served date and parties included
* Served stamp is applied to coversheet


### Incomplete Entries
* Docket entry can be saved without adding a PDF document as an incomplete entry
* incomplete entries appear on the docket record with yellow background and yellow pin icon
* when clerk clicks on document link from docket record, navigates to the Edit Docket Entry screen with warning message displayed
* Docket Clerk can add the document and save to complete the entry  
