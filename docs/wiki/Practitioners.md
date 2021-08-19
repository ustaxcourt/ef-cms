[Return to Directory](./README.md)

# Practitioners

## [Practitioner Database](./Practitioner-Database.md)

## Practitioner Contact Information

### Practitioner edits their own contact info from dashboard
If Address is changed by practitioner user on Edit Contact Information screen:
* a Notice of Address Change is generated and displays on docket record for all cases associated with the practitioner
* Updated address displays in Practitioner DB

If primary Phone number is changed by practitioner user on Edit Contact Information screen:
* a Notice of Telephone Number is generated and displays on docket record for all cases associated with the practitioner
* Updated phone number displays on Practitioner DB

If Address and primary Telephone number are changed by practitioner user on Edit Contact Information screen
* a Notice of Address and Telephone Number Change is generated and displays on docket record for all cases associated with the practitioner
* Updated address and phone number displays on Practitioner Database

If Address and primary Telephone number are changed in DB:
* a Notice of Address and Telephone Number Change is generated and displays on docket record for all cases associated with the practitioner
* Updated address and phone number displays on "Practitioner Dashboard" , "Edit Contact Information" form, and on the Case Detail > Petitioner Counsel section of all cases the practitioner is associated with

### Practitioner edits their email address
* Practitioner users can update their email address through the user menu, My Account screen
* New email must meet the following criteria:
   * email must be in valid format - Error message “Enter a valid email address”
   * email cannot already exist - Error message “An account with this email already exists. Enter a new email address.”
   * “New email address” and Re-enter email” fields must match - Error - “Email addresses do not match.”

**On Save of new email**
*  Verification email is sent to new email
* Old email is still valid until the new email is verified

**On click of Verify link for new email**
* Old email is invalid
* New email is valid for login and service
* All cases are updated with new email
