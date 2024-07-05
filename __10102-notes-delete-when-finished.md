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

*Question*: When should we enable/disable "Save as Draft" button?
*Answer*: Always leave it enabled per Chris + UX.

*Question*: What should the order title be? Same as docket entry description? Apart from being displayed above the PDF preview, what is the purpose of the docket entry description field?
*Answer*: Checked with Chris, this is meant to function as the order title, which is used when serving the response.

*Question*: If a case is stricken from the trial session, should "it is further" be displayed conditionally if there are additional fields?
*Answer*: Each line should display "it is further" if there's additional text below (Minus the first).

## Things to do

- write integration tests (solo / group)
    - scraping pdf functionality

- when refreshing the page that has the StatusReportOrderResponse component, some issues occur (should we address?)

- Test same process of creating order response from messages (group / solo)

- Add unit test for statusReportOrderResponsePdfUrlAction and for getStatusReportOrderResponseDocketNumbersToDisplayAction.ts

- Run through all tests case + DoD checklist (group / solo)

## Feedback from judges:

1. Formatting of separate clauses should be: indent first line beginning with "ORDERED", following lines should return to left margin as in the example PDF you sent (so, normal paragraph formatting).

2. Dates should have the following format in all cases where they've been generated/selected: "Month DD, YYYY" (essentially, spell out the month).

## Notes

The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")
