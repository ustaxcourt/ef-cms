import { getIdOfLastSentMessage } from '../messages/get-id-of-last-sent-message';

export const adcStampGrantsAMotion = (
  docketNumber: string,
  messageId: string,
) => {
  cy.login('adc1', `/messages/${docketNumber}/message-detail/${messageId}`);
  cy.get('[data-testid="apply-stamp"]').click();
  cy.get('[data-testid="motion-disposition-Granted"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
  cy.get('#button-reply').click();
  cy.get('#message').type('Motion stamped');
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
  return getIdOfLastSentMessage();
};
