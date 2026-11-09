import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import {
  loginAsColvinChambers,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { sendMessageOnCase } from '../../../../helpers/messages/send-message-on-case';

describe('Dashboard - Chambers Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    // ensure the Recent Messages table has at least one row with a docket number link
    const subject = `Chambers a11y ${getCurrentDateTimeInMillis()}`;
    loginAsDocketClerk();
    sendMessageOnCase({
      docketNumber: '103-20',
      subject,
      to: {
        chambers: 'colvinsChambers',
        recipient: "Test Colvin's Chambers",
        section: 'Chambers',
      },
    });

    loginAsColvinChambers();
    cy.contains('tr', subject).should('exist');

    checkA11y();
  });

  describe('Submitted/CAV tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="submitted-cav-cases-tab"]').click();
      cy.get('[data-testid="case-worksheets-total-count-text"]');

      checkA11y();
    });
  });

  describe('Pending Motions tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="pending-motions-tab"]').click();
      cy.get('[data-testid="pending-motions-total-count-text"]');

      checkA11y();
    });
  });
});
