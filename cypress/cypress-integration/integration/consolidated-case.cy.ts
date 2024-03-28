import { getCaseDetailTab } from '../support/pages/case-detail';

describe('Docket clerk views consolidated case', function () {
  describe('case detail header', () => {
    it('should display lead case tag on the lead case in a consolidated group', () => {
      cy.login('docketclerk');
      cy.visit('/case-detail/111-19');
      cy.get('#lead-case-tag').should('exist');
    });

    it('should persist the selected sort filter by navigating away from the tab', () => {
      cy.get('select[name="docketRecordSort.111-19"]').should(
        'have.value',
        'byDate',
      );
      cy.get('select[name="docketRecordSort.111-19"]').select('Newest');
      cy.get('#tab-document-view').click();
      cy.get('#tab-docket-sub-record').click();
      cy.get('select[name="docketRecordSort.111-19"]').should(
        'have.value',
        'byDateDesc',
      );
    });

    it('should persist the populated consolidated cases in the overview tab when petitioner counsel is added to parties', () => {
      getCaseDetailTab('case-information').click();
      getCaseDetailTab('parties').click();
      cy.get('input#practitioner-search-field').clear();
      cy.get('input#practitioner-search-field').type('PT1234');
      cy.get('button#search-for-practitioner').click();
      cy.get('label.usa-checkbox__label').scrollIntoView();
      cy.get('label.usa-checkbox__label').click();
      cy.get('button#modal-button-confirm').click();
      getCaseDetailTab('overview').click();
      cy.contains('a', '112-19L').should('exist');
    });

    it('should persist the populated consolidated cases in the overview tab when respondent counsel is added to parties', () => {
      getCaseDetailTab('parties').click();
      cy.get('button#respondent-counsel').click();
      cy.get('input#respondent-search-field').clear();
      cy.get('input#respondent-search-field').type('RT6789');
      cy.get('button#search-for-respondent').click();
      cy.get('button#modal-button-confirm').click();
      getCaseDetailTab('overview').click();
      cy.contains('a', '112-19L').should('exist');
    });

    it('should persist the populated consolidated cases in the overview tab when correspondence is deleted', () => {
      getCaseDetailTab('correspondence').click();
      cy.get('a#add-correspondence-file').click();

      cy.get('input#upload-description').clear();
      cy.get('input#upload-description').type('temp correspondence');
      cy.get('[data-testid="upload-pdf-button"]').click();
      cy.get('input#primaryDocumentFile-file').attachFile(
        '../fixtures/w3-dummy.pdf',
      );
      cy.get('[data-testid="remove-pdf"]');
      cy.get('button#upload-correspondence').click();
      // delete correspondence
      cy.contains('button', 'Delete').click();
      cy.contains('button', 'Yes, Delete').click();

      getCaseDetailTab('case-information').click();
      // verify Consolidated Cases is not empty
      cy.contains('a', '112-19L').should('exist');
    });
  });
});
