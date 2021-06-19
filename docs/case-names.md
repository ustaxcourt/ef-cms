# Case Names

There are several values used throughout the system to identify cases by name.

`caseCaptionWithPostfix`:
* Not stored directly on the case but can be computed when needed by appending the `CASE_CAPTION_POSTFIX` constant to the `caseCaption`
* Example: `Selma Horn & Cairo Harris, Petitioners v. Commissioner of Internal Revenue, Respondent`

`caseCaption`:
* The only computed name value stored directly on the case in persistence
* Example: `Selma Horn & Cairo Harris, Petitioners`

`caseTitle`:
* Not stored directly on the case - use method `Case.getCaseTitle(caseCaption)` to retrieve value
* Displayed in tables and work queues in the UI to identify a case for internal users
* Persisted on work items to be displayed in the work queues to eliminate the need to retrieve the value from each individual case
* Example: `Selma Horn & Cairo Harris`

`caseCaptionExtension`:
* Not stored on the case, but can be computed by getting the `caseTitle` and replacing it with '' in the `caseCaption`
* Typically used in PDFs for proper case caption placement
* Example: `Petitioner(s)`
