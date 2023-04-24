import {
  getWorkItemCheckboxLabel,
  getWorkItemRow,
  navigateTo as navigateToDashboard,
  selectAssignee,
  viewDocumentQCSectionInbox,
} from '../support/pages/dashboard';

describe('Assign a work item', () => {
  it('views the section inbox', () => {
    navigateToDashboard('petitionsclerk');
    viewDocumentQCSectionInbox();
    getWorkItemRow('102-20S').should('exist');
  });

  it('assigns the work item to self', () => {
    getWorkItemCheckboxLabel('77d8449a-ffe1-48e5-b056-a6112a819a4b').click();
    selectAssignee('Test Petitionsclerk');
  });

  it('creates a section inbox message in this work item', () => {
    getWorkItemRow('102-20S')
      .contains('td.to', 'Test Petitionsclerk')
      .should('exist');
  });

  it('views the docket section qc inbox', () => {
    navigateToDashboard('docketclerk');
    viewDocumentQCSectionInbox();
    cy.get('#label-workitem-select-all-checkbox').click();
    cy.get('.message-select-control input:checked').then(elm => {
      cy.get('.assign-work-item-count-docket').should(
        'contain',
        elm.length - 1,
      );
    });
    cy.get('#assignmentFilter').select('Unassigned');

    cy.get('.message-select-control input:checked').should('have.length', 0);
  });
});
