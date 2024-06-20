# 10102

## Cases for testing during development

- Regular case: 107-19L
- Lead case: 102-67L

## Questions for UX/PO

*Question*: Should the "Docket entry description" textarea field have a
restriction on its character length similar to "Additional order text" above?
*Answer*: Check docket entry description field for docket clerks.

*Question*: The test case says that the "Additional order text" field should be
only 140 or 160 characters long. Which is it?
*Answer*: Check the stamp disposition workflow.

## Things to do

1. Update OrderResponse component to display all validation messages

2. Get logic working that conditionally makes the first question required only
if the case is a lead case

3. Get logic working that conditionally allows the user to it the "Save as Draft"
button depending on whether the minimum amount of fields are populated

4. Figure out how to handle the side-by-side form and in-progress PDF situation

## Notes

The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")
