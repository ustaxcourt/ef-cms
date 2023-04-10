exports.unchecksOrdersAndNoticesBoxesInCase = () => {
  cy.get('label[for="notice-of-attachments"]').scrollIntoView();
  cy.get('label[for="notice-of-attachments"]').click();
  cy.get('label[for="order-for-ratification"]').scrollIntoView();
  cy.get('label[for="order-for-ratification"]').click();
};
