import {
  loginAsAdc,
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import {
  createGrantDenyMotionCase,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
  openGrantDenyMotionFromMessage,
  type GrantDenyMotionCaseFixture,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from 'cypress/local-only/support/pages/document-qc';

describe('Grant/Deny Motion UI shell (T13532, T13544)', () => {
  const clickBackFromGrantDenyForm = (): void => {
    cy.contains('button', 'Back').click();
  };

  const openMessageFromInbox = (docketNumber: string): void => {
    cy.visit('/messages/my/inbox');
    cy.get(
      `[data-testid="messages-individual-inbox-subject-cell-${docketNumber}"]`,
    )
      .first()
      .click();
    cy.get('[data-testid="message-detail-container"]').should('exist');
  };

  const assertEmptyFormShell = (): void => {
    cy.get('[data-testid="motion-disposition-GRANTED"]').should(
      'not.be.checked',
    );
    cy.get('[data-testid="motion-disposition-DENIED"]').should(
      'not.be.checked',
    );
    cy.get('[data-testid="stricken-from-trial-session"]').should('be.disabled');
    cy.get('[data-testid="jurisdiction-restored"]').should('be.disabled');
    cy.get('[data-testid="jurisdiction-retained"]').should('be.disabled');
    cy.get('[data-testid="jurisdiction-retained-label"]').should(
      'contain.text',
      'Retained',
    );
    cy.get('[data-testid="jurisdiction-restored-label"]').should(
      'contain.text',
      'Restored to the general docket',
    );
  };

  const assertGrantDenyLinkHasStampIcon = (): void => {
    cy.get('[data-testid="grant-deny-motion"]')
      .find('svg[data-icon="stamp"]')
      .should('exist');
  };

  describe('docket record path (T13532)', () => {
    let motionCase: GrantDenyMotionCaseFixture;

    before(() => {
      createGrantDenyMotionCase().then(result => {
        motionCase = result;
      });
    });

    beforeEach(() => {
      Cypress.session.clearCurrentSessionData();
    });

    it('should show the form shell and return to motion preview on Cancel (Judge)', () => {
      loginAsColvin();
      cy.visit(`/case-detail/${motionCase.docketNumber}`);
      openGrantDenyMotionFromDocketRecord();
      assertEmptyFormShell();

      clickBackFromGrantDenyForm();
      cy.url().should(
        'match',
        new RegExp(`/case-detail/${motionCase.docketNumber}$`),
      );
      cy.get('[data-testid="document-view-container"]').should('be.visible');
      cy.get('[data-testid="grant-deny-motion"]').should('be.visible');
    });

    it('should show the form shell for Chambers on a seeded case', () => {
      loginAsColvinChambers();
      cy.visit(
        '/case-detail/105-20/documents/3eb53932-1a44-40d1-bfb8-d9e908b0b32e/grant-deny-motion-create',
      );
      assertEmptyFormShell();
    });

    it('should show the form shell for ADC on a seeded case', () => {
      loginAsAdc();
      cy.visit(
        '/case-detail/105-20/documents/3eb53932-1a44-40d1-bfb8-d9e908b0b32e/grant-deny-motion-create',
      );
      assertEmptyFormShell();
    });

    it('should show the Grant/Deny link with stamp icon on the motion document view', () => {
      loginAsColvin();
      cy.visit(`/case-detail/${motionCase.docketNumber}`);
      cy.get('#tab-document-view').click();
      cy.contains(GRANT_DENY_MOTION_TYPE).click();
      assertGrantDenyLinkHasStampIcon();
    });
  });

  describe('message attachment path (T13544)', () => {
    beforeEach(() => {
      Cypress.session.clearCurrentSessionData();
    });

    it('should show the form shell from a message attachment', () => {
      createGrantDenyMotionCase().then(fixture => {
        loginAsDocketClerk1();
        cy.visit(`/case-detail/${fixture.docketNumber}`);
        createMessage();
        selectSection('Chambers');
        selectChambers('colvinsChambers');
        selectRecipient('Judge Colvin');
        enterSubject();
        fillOutMessageField();
        cy.get('[data-testid="select-document"]').select(
          fixture.motionDocketEntryId,
        );
        sendMessage();

        loginAsColvin();
        openMessageFromInbox(fixture.docketNumber);

        assertGrantDenyLinkHasStampIcon();
        openGrantDenyMotionFromMessage();
        assertEmptyFormShell();
      });
    });

    it('should return to message detail with one Cancel click after multiple Preview PDF clicks', () => {
      createGrantDenyMotionCase().then(fixture => {
        loginAsDocketClerk1();
        cy.visit(`/case-detail/${fixture.docketNumber}`);
        createMessage();
        selectSection('Chambers');
        selectChambers('colvinsChambers');
        selectRecipient('Judge Colvin');
        enterSubject();
        fillOutMessageField();
        cy.get('[data-testid="select-document"]').select(
          fixture.motionDocketEntryId,
        );
        sendMessage();

        loginAsColvin();
        openMessageFromInbox(fixture.docketNumber);
        openGrantDenyMotionFromMessage();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="preview-pdf-button"]').click();
        cy.wait('@courtIssuedOrder');
        cy.get('[data-testid="preview-pdf-button"]').click();
        cy.wait('@courtIssuedOrder');
        cy.get('[data-testid="preview-pdf-button"]').click();
        cy.wait('@courtIssuedOrder');

        clickBackFromGrantDenyForm();
        cy.url().should(
          'match',
          new RegExp(
            `/messages/${fixture.docketNumber}/message-detail/[a-f0-9-]+$`,
          ),
        );
      });
    });
  });
});
