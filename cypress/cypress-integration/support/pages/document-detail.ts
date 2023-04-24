export const navigateTo = (username, docketNumber, docketEntryId) => {
  cy.login(username, `/case-detail/${docketNumber}/documents/${docketEntryId}`);
};

export const getMessagesTab = () => {
  return cy.get('button#tab-pending-messages');
};

export const getInProgressTab = () => {
  return cy.get('button#tab-messages-in-progress');
};

export const getCreateMessageButton = () => {
  return cy.get('button#create-message-button');
};

export const getSectionSelect = () => {
  return cy.get('select#section');
};

export const getAssigneeIdSelect = () => {
  return cy.get('select#assigneeId');
};

export const getMessageTextArea = () => {
  return cy.get('textarea#message');
};

export const getSendMessageButton = () => {
  return cy.get('.modal-dialog').contains('Send');
};

export const getCardContaining = text => {
  return cy.get('.card').contains(text);
};

export const getModal = () => {
  return cy.get('.modal-dialog');
};
