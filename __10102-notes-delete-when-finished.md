# 10102

## Questions for UX

1. Should the "Docket entry descripton" textarea field have a restriction on its
character length similar to "Additional order text" above?

2. Are the "Additional order text" and the "Docket entry description" textarea
fields required or optional?

Answer: Yes. The following fields on the form are optional:
- order type
- striken from trial
- jurisdiction
- additional order text

Assumption moving forward is that issueOrder radio group is required if the case
is a lead case (defaults to "All cases in this group")

