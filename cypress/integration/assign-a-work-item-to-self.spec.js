const {
  getSectionUsersSelect,
  getWorkItemCheckboxLabel,
  getWorkItemMessage,
  getWorkItemMessages,
  getWorkItemRow,
  navigateTo: navigateToDashboard,
  viewDocumentQCMyInbox,
  viewDocumentQCSectionInbox,
} = require('../support/pages/dashboard');

describe('Assign a work item ', () => {
  before(() => {
    cy.seed();
  });

  it('views the section inbox', () => {
    navigateToDashboard('petitionsclerk');
    viewDocumentQCSectionInbox();
    cy.wait(3000); // TODO: find a way to avoid this... we need to wait for the XHR and the list to resort
    getWorkItemRow('101-19W').should('exist');
  });

  it('assigns the work item to self', () => {
    getWorkItemCheckboxLabel('2611344f-f7bf-4f47-8ba0-60c70cb25446').click();
    getSectionUsersSelect().select('Test Petitionsclerk');
    cy.wait(3000); // TODO: find a way to avoid this... we need to wait for the XHR and the list to resort
  });

  it('creates a section inbox message in this work item', () => {
    getWorkItemRow('101-19W')
      .contains('td.to', 'Test Petitionsclerk')
      .should('exist');

    getWorkItemRow('101-19W')
      .contains('a', 'Petition')
      .click();
    getWorkItemMessages();

    getWorkItemMessage('2611344f-f7bf-4f47-8ba0-60c70cb25446').contains(
      'Petition filed by Brett Osborne is ready for review.',
    );
  });

  it('places the work item in the petitionsclerk my inbox', () => {
    navigateToDashboard('petitionsclerk');
    viewDocumentQCMyInbox();
    getWorkItemRow('101-19W').should('exist');
  });
});
