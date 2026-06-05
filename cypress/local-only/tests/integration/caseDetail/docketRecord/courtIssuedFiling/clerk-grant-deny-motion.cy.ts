import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsClerkOfCourt,
  loginAsDocketClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectRecipient,
  selectSection,
  sendMessage,
} from 'cypress/local-only/support/pages/document-qc';

type MotionCaseFixture = {
  docketNumber: string;
  motionDocketEntryId: string;
};

describe('Clerk of Court grants/denies a motion (replaces Apply Stamp flow)', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for Continuance';

  const createMotionCase = (): Cypress.Chainable<MotionCaseFixture> => {
    loginAsCaseServicesSupervisor();

    return createAndServePaperPetition({ yearReceived: '2025' }).then(
      ({ docketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        return createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        }).then(({ docketEntryId }) => {
          return cy.wrap({
            docketNumber,
            motionDocketEntryId: docketEntryId,
          });
        });
      },
    );
  };

  const openGrantDenyMotionFromDocumentView = (docketNumber: string): void => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains(motionType).click();
    cy.get('[data-testid="grant-deny-motion"]').should('be.visible').click();
    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.visible');
  };

  const openGrantDenyMotionFromInboxMessage = (
    fixture: MotionCaseFixture,
  ): void => {
    loginAsDocketClerk1();
    cy.visit(`/case-detail/${fixture.docketNumber}`);
    createMessage();
    selectSection('clerkofcourt');
    selectRecipient('Test Clerk of Court');
    enterSubject();
    fillOutMessageField();
    cy.get('[data-testid="select-document"]').select(
      fixture.motionDocketEntryId,
    );
    sendMessage();

    loginAsClerkOfCourt();
    cy.visit('/messages/my/inbox');
    cy.get(
      `.message-subject > .message-document-title > [data-testid="messages-individual-inbox-subject-cell-${fixture.docketNumber}"]`,
    )
      .first()
      .click();
    cy.get('[data-testid="message-detail-container"]').should('exist');
    cy.get('[data-testid="grant-deny-motion"]').should('be.visible').click();
    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.visible');
  };

  describe('case NOT part of a trial session', () => {
    it('should let a clerk of court create a draft Order granting the motion from document view', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsClerkOfCourt();
        openGrantDenyMotionFromDocumentView(docketNumber);

        cy.get('[data-testid="stricken-from-trial-session"]').should(
          'be.disabled',
        );
        cy.get('[data-testid="jurisdiction-restored"]').should('be.disabled');
        cy.get('[data-testid="jurisdiction-retained"]').should('be.disabled');

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="motion-disposition-GRANTED"]').should(
          'be.checked',
        );

        cy.get('[data-testid="add-additional-order-text"]').click();
        cy.get('[data-testid="additional-order-text-0"]').type(
          'this is the additional order text',
        );

        cy.get('[data-testid="docket-entry-preview"]').should(
          'contain.text',
          'Order',
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(
            `On ${formattedToday}, petitioner filed a ${motionType}`,
          );
          expect(html).to.include(
            `ORDERED that petitioner's ${motionType} is granted.`,
          );
          expect(html).to.include(
            'ORDERED that this is the additional order text.',
          );
          expect(html).to.not.include('stricken from');
          expect(html).to.not.include('set for trial at the session');
        });

        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="skip-signature-button"]').click();

        cy.url().should('contain', `/case-detail/${docketNumber}`);
        cy.get('[data-testid="tab-drafts"]').click();
        cy.contains(`Order - ${motionType} is granted`).should('be.visible');
      });
    });
  });

  describe('message detail view', () => {
    it('should let a clerk of court grant a motion from a message and return to message detail after signing', () => {
      const messageDetailUrlPattern = /messages\/\d{3}-\d{2}\/message-detail/;

      createMotionCase().then(fixture => {
        openGrantDenyMotionFromInboxMessage(fixture);

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="motion-disposition-GRANTED"]').should(
          'be.checked',
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(
            `ORDERED that petitioner's ${motionType} is granted.`,
          );
        });

        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();

        cy.url().should('match', messageDetailUrlPattern);
        cy.get('[data-testid="message-attachments"]')
          .children()
          .should('have.length.at.least', 2);
        cy.get('[data-testid="message-attachments"]')
          .contains('Order')
          .should('exist');
      });
    });
  });
});
