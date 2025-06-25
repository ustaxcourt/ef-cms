- 10495 original approach notes
TODO: Update updateUser/upsertUsers to always check for practitioner role and persist practitioner data if applicable
TODO: Consider doing the same when fetching user data
TODO: Do we need to always join on dwUser when we get a practitioner? In these
functions below, we do not do this:
- getPractitionersForCase
- getIrsPractitionerOnCase
- getPrivatePractitionerOnCase
