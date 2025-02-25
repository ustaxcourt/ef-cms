import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Edit Docket Entry - Change Doc Type', function () {
  it('should clear service date input when a new doc type is selected', () => {
    cy.login('docketclerk');
    cy.visit('case-detail/104-19/docket-entry/3/edit-meta'); // TODO 23803: Do not use seed data. Edit a paper filing.
    selectTypeaheadInput(
      'edit-docket-entry-meta-document-type-search',
      'Certificate of Service',
    );
    cy.get('input#date-of-service-picker').clear();
    cy.get('input#date-of-service-picker').type('01/01/2020');
    cy.get(
      '[data-testid="edit-docket-entry-meta-document-type-search"] .select-react-element__clear-indicator',
    ).click();
    selectTypeaheadInput(
      'edit-docket-entry-meta-document-type-search',
      'Amended Certificate of Service',
    );
    cy.get('[data-testid="date-of-service-picker"]')
      .eq(1)
      .should('have.value', '');
  });
});
