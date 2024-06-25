# 10102

## Cases for testing during development

- Regular case: 107-19L
http://localhost:1234/case-detail/107-19/documents/1a4f0f89-3441-4334-b6b3-e35b93b16c22/order-response

- Lead case: 102-67L

## Questions for UX/PO

*Question*: Should the "Docket entry description" textarea field have a
restriction on its character length similar to "Additional order text" above?
*Answer*: Check docket entry description field for docket clerks.

*Question*: The test case says that the "Additional order text" field should be
only 140 or 160 characters long. Which is it?
*Answer*: Check the stamp disposition workflow.

*Question*: When should we enable/disable "Save as Draft" button?
*Answer*: Always leave it enabled per Chris + UX. 

*Question*: What should the order title be? Same as docket entry description? 
*Answer*: ??

## Things to do

- Finish submit Order as Draft (Note: Edit should reopen form, maybe special order type?)

- Figure out how to handle the Preview Pdf Functionality (UX committed to creating additional mock on 6/26/2024)

- Update CSS to Match Mocks

- Determine if Additional order text should maintain formatting (line breaks + spacing, thought is yes?)

- Undraft Response Order to Docket Entry


## Notes

The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")
