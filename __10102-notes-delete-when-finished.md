# 10102

## Questions for UX

1. Should the "Docket entry descripton" textarea field have a restriction on its
character length similar to "Additional order text" above?

2. The test case says that the "Additional order text" field should be only 140 or
160 characters long. Which is it?

## Things to do

1. Finish validation logic for StatusReportOrderResponseForm entity

2. Update OrderResponse component to display validation messages (sequence, actions)

3. Get logic working that conditionally includes the question that only applies
to lead cases

4. Get logic working that conditionally allows the user to it the "Save as Draft"
button depending on whether the minimum amount of fields are populated

5. Figure out how to handle the side-by-side form and in-progress PDF situation

## Notes

The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")
