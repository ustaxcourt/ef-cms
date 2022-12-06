describe('Docket clerk views consolidated case', function () {
  before(() => {
    cy.login('docketclerk');
  });

  describe('case detail header', () => {
    it('should display lead case tag on the lead case in a consolidated group', () => {
      cy.visit('/case-detail/111-19');
      cy.get('#lead-case-tag').should('exist');
    });

    it('should persist the selected sort filter by navigating away from the tab', () => {
      cy.get('select[name="docketRecordSort.111-19"]').should(
        'have.value',
        'byDate',
      );
      cy.get('select[name="docketRecordSort.111-19"]').select('Sort by newest');
      cy.get('#tab-document-view').click();
      cy.get('#tab-docket-sub-record').click();
      cy.get('select[name="docketRecordSort.111-19"]').should(
        'have.value',
        'byDateDesc',
      );
    });
  });
});
