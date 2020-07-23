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

## Document Title (Docket Record)
* Order of docket entry information: [Concatenated Document Title] [Additional Line 1 (C/S 04/17/19)(Attachment(s)) (Objection) (Lodged) Additional Line 2

## Filed by
**Other Filing Party as the only filing party**
Filed By should displays in format:  [Other Filing Party Name]

**Other Filing Party with multiple filing parties**
* Other filing party name should be appended to the other Filed By information : Resp. & Petr. [Primary Contact], [Other Filing Party Name]
