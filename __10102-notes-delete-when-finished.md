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

*Question*: What should the order title be? Same as docket entry description? Apart from being displayed above the PDF preview, what is the purpose of the docket entry description field?
*Answer*: Checked with Chris, this is meant to function as the order title, which is used when serving the response.

*Question*: If a case is stricken from the trial session, should "it is further" be displayed conditionally if there are additional fields? 
*Answer*: Each line should display "it is further" if there's additional text below.

## Things to do

- Edit view must use the OrderResponse.tsx component

- Update CSS to Match Mocks (pre tag should match existing formatting)

- Format so each line after the first is indented, send copy of PDF for review Monday EoD with all options, also show example without indented. 


## Notes

The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")
