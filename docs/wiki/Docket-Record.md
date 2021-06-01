[Return to Directory](./README.md)

# Docket Record
* Default sort for docket record is oldest activity to newest (chronological)
* A new docket entry is created upon submission of an external document
* Filed By columns display order for multiple parties is Petitioner, Petitioner Counsel & Respondent
* Document title link is active for internal and external users. For internal users, link opens the Document Detail page. For external users, link opens the document PDF. Public users do not have access to the link.
* Docket entries initiated during petition QC are added to the docket record upon "Serve to IRS" (example, changes to case caption or docket number during QC)
* Docket entries can be edited by internal users at any time during the case (not implemented yet)
* Docket entries can be deleted by internal users (not implemented yet)
* Request for Place of Trial is listed as an event docket entry with no document link if the place of trial was entered as metadata. If a paper Request for Place of Trial document is received, the docket entry contains a document link and functions the same as any electronically filed document
* Pages displays on docket record to inform all users on how many pages including the coversheet the documents include

## Documents Waiting QC on Docket Record
* Documents filed but not QC'd display on Docket Record as bold with a red star icon
* Once QC is complete, the entry displays as standard

## Sorting
* Default sorting is by Filed date, then Index number  

### Index
**Petition and initial documents**
* eFiled and paper-filed Petition and initial documents display an index number associated when filed (i.e. before they are served to IRS)
* Initial documents (RQT, ODS, APW) filed after the Petition will display an index number only after service

**Paper-filed documents**
* Docket entry does not have index number until the document is served

**Court-issued documents**
* Docket entry does not have index number until the document is served

**Minute Entries**
* Docket entries display index number when added to docket record

**Court-issued documents that are not served**
* Unservable documents are given an index number when added to the docket record


### Document Title (Docket Record)
* Order of docket entry information: [Concatenated Document Title] [Additional Line 1 (C/S 04/17/19)(Attachment(s)) (Objection) (Lodged) Additional Line 2

### Filed by
**Other Filing Party as the only filing party**
* Filed By should displays in format:  [Other Filing Party Name]

**Other Filing Party with multiple filing parties**
* Other filing party name should be appended to the other Filed By information : Resp. & Petr. [Primary Contact], [Other Filing Party Name]

### Action
* Populated by text entered in Action field on the Edit Docket Entry screen
* can only be added by Docket Clerk

### Served
* Displays the Served date of the document
* Paper-filings and court-issued documents that have been added to the docket record but not served display "Not Served" in red text until they are served

### Parties
* Displays indicator for which parties were served
* R = Respondent
* B = Both
* P = Petitioner (not implemented yet)

## Stricken Docket Entries
* Docket clerks have the ability to strike a docket entry
* Striking a docket entry adds a strikethrough to the filed date and document title, and appends the word (STRICKEN) to the filings and proceedings
* Stricken entries remain hyperlinked for internal users
* Stricken entries are not hyperlinked for external parties or public users, but are visible on the docket record
