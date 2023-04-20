export const unchecksOrdersAndNoticesBoxesInCase = () => {
  cy.get('label[for="notice-of-attachments"]').scrollIntoView().click();
  cy.get('label[for="order-for-ratification"]').scrollIntoView().click();
};
