const {
  getWorkItemCheckboxLabel,
  getWorkItemRow,
  navigateTo: navigateToDashboard,
  selectAssignee,
  viewDocumentQCSectionInbox,
} = require('../support/pages/dashboard');

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
});
