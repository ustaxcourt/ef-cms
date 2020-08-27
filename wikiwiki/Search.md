[Return to Directory](./README.md)

## Advanced Search

### Case search
* Can search by docket number or petitioner name
* When searching by docket number, name fields are cleared and vice versa

#### Search by Docket Number
* Must be in format XXX-XX (including year)
* Exact match goes directly to Case Detail
* No match displays "No match" messaging
* Available to unauthenticated users, practitioners, respondent, and internal users
* Not available to authenticated petitioners

#### Search by Name
* if there is an exact match, displays exact match as first results, with fuzzy results below
* If only one match, search result is still displayed in table (does not go directly to Case Detail)
* If more than one match, displayed in order of relevancy (determined by elasticsearch)
* Results include any names that are included in the case caption (may not be the "petitioner")  

## Practitioner search

### Search by name
* should search First Name and Last Name fields
* matching results should be sorted by relevancy
**Sort Order**
* Exact matches (if multiple exact matches- sort them by bar number)
* Partial matches by relevancy (same as Petitioner name search)

### Search by bar number
* if there is exact match, navigate to Practitioner Info page (design to be implemented in 4365)
* if there is no exact match, display "No matching results"

## Order search
* search is limited to Orders that have been served
* Orders in sealed cases display in internal order search results but do NOT display in public order search results

#### Search by keyword
* is required for search
* searches Order title and text content

#### Filters (narrow your search)
**Docket Number or Case Title**
* User can filter by either a docket number or the case title/petitioner's name
* If both fields are entered, user will receive error

**Judge**
* Filters by the judge who signed the order

**Start Date - End Date**
* Filters by the served date of the order
* If a Start date is entered but no end date, the end date defaults to today



## Opinion search
* search is limited to Opinions that have been served
* Opinions for sealed cases appear in internal and public Opinion search results

#### Search by keyword
* is required for search
* searches Opinion title and text content

#### Filters (narrow your search)
**Docket Number or Case Title**
* User can filter by either a docket number or the case title/petitioner's name
* If both fields are entered, user will receive error

**Opinion type**
* Filters opinion by type: T.C. Opinion, Summary Opinion, and Memorandum Opinion

**Judge**
* Filters by the judge associated with the opinion (as seen on docket entry)

**Start Date - End Date**
* Filters by the served date of the opinion
* If a Start date is entered but no end date, the end date defaults to today
