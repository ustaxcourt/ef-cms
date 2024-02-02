::: Cypress Testing Organization :::

GOAL: What have we agreed to so far?

Feature Based (Works well with a few exceptions to that rule)
  - What is a feature? 
      Entity? Subset of Work? Component? Page? 
  - What about bugs?

::: File Structure ::

cypress/
  cypress-integration/
  integration/
    <feature_dir>/
      <test_file>.cy.ts
  helpers/ (All test helpers should live here)
    <feature_dir>/
      <helper_file>.ts
  support/

