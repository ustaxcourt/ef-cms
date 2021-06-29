[Return to Directory](./README.md)

## Adding Practitioners to Database

* Can be done by a bulk import or by manually adding a single practitioner
* DB includes all practitioners (private, IRS, DOJ) admitted to the Tax Court bar

**Practitioner Name**
* for input only, practitioner name should be entered as First Name, Middle Name, Last Name, Suffix
* First Name, Last Name are required
* System automatically assigns a Bar number in format: {Last_Initial}{First_Initial}{YY}{count}; where count is a 3-digit number that resets and starts at 001 each year and is the cumulative number of new practictioners for a given for that year

**Birth Year**
* Required field

**Practitioner type**
* Options are Attorney or Non-attorney
* Non-attorney = Tax Court allows individuals who are not attorneys to practice if they have passed the Tax Court Non-Attorney Exam; in the ef-cms, they are treated the same as attorneys

**Employer**
* Options are Private, IRS, or DOJ

**Firm name**
* If "Private" is selected for employer= firm name field is displayed and optional
* If "IRS" or "DOJ" is selected for employer= firm name field is hidden

**Contact fields**
* use standard address, contact, and phone fields and functionality
* Practitioner can edit their contact information via their Dashboard

**Email**
* will be the login email for Cognito
* is not editable

**Original bar state**
* Dropdown should include all options from standard State dropdown and a "N/A" option

**Admission status**
* Field should display "Active" as read-only in form
* Other admission statuses for Bulk Import
* Admission clerks will only be adding Active attorneys to the DB on an individual basis. When we do the initial import of attorneys, all attorneys will be created in the DB, but only active attorneys will be created in Cognito.

* Active - attorney should be added to the DB and as an active user in Cognito
* Suspended
* Disbarred
* Resigned
* Deceased
Inactive

**Only Active attorneys can be added to a case**

**Admission date**
* Field is required
* Error message if incomplete on submit: "Enter an admission date"
* Date Cannot be in the future - error message "Date cannot be in the future. Enter valid admission date."

**On Submit**
* new attorney is created in the DB with automated bar number generated
* user is navigated to the Practitioner Detail screen with success message displayed

## Practitioner without email address
* Although email is required to add a practitioner to the database, some practitioners were migrated into the system without an email address
* Practitioners without email automatically default to paper service


## Editing Practitioner information
### Adding email address for a practitioner without email
* When adding an email to a practitioner who previously had no email on record, the practitioner service indicator updates to electronic for all existing cases assciated with that practitioner

### Admissions clerk edits practitioner contact info in DB
If Address is changed in DB:
* a Notice of Address Change is generated and displays on docket record for all cases associated with the practitioner
* Updated address displays on "Practitioner Dashboard" , "Edit Contact Information" form, and on the Case Detail > Petitioner Counsel section of all cases the practitioner is associated with

If primary Phone number is changed in DB:
* a Notice of Telephone Number is generated and displays on docket record for all cases associated with the practitioner
* Updated phone number displays on "Practitioner Dashboard" , "Edit Contact Information" form, and on the Case Detail > Petitioner Counsel section of all cases the practitioner is associated with
