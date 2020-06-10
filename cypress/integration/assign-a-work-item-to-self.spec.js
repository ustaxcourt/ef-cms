const {
  getWorkItemCheckboxLabel,
  getWorkItemRow,
  navigateTo: navigateToDashboard,
  selectAssignee,
  viewDocumentQCSectionInbox,
} = require('../support/pages/dashboard');

describe('Assign a work item ', () => {
  it('views the section inbox', () => {
    navigateToDashboard('petitionsclerk');
    viewDocumentQCSectionInbox();
    getWorkItemRow('101-19W').should('exist');
  });

  it('assigns the work item to self', () => {
    getWorkItemCheckboxLabel('2611344f-f7bf-4f47-8ba0-60c70cb25446').click();
    selectAssignee('Test Petitionsclerk');
  });

  it('creates a section inbox message in this work item', () => {
    getWorkItemRow('101-19W')
      .contains('td.to', 'Test Petitionsclerk')
      .should('exist');
  });
});
