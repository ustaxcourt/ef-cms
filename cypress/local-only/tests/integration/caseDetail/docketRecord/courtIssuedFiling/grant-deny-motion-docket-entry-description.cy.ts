import {
  loginAsColvin,
  loginAsDocketClerk,
} from 'cypress/helpers/authentication/login-as-helpers';
import {
  createGrantDenyMotionCase,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion docket entry description', () => {
  const expectedDocumentDescription = `Order - ${GRANT_DENY_MOTION_TYPE} is granted`;

  const createSignedGrantDenyMotionDraft = (docketNumber: string): void => {
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
    openGrantDenyMotionFromDocketRecord();

    cy.get('[data-testid="motion-disposition-GRANTED"]').click({
      force: true,
    });

    cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
    cy.get('[data-testid="save-draft-button"]').click();
    cy.wait('@courtIssuedOrder');

    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
    cy.get('[data-testid="tab-drafts"]').click();
    cy.contains(expectedDocumentDescription).should('be.visible');
  };

  const openAddDocketEntryForGrantDenyDraft = (docketNumber: string): void => {
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-drafts"]').click();
    cy.get('button').contains(expectedDocumentDescription).click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  };

  it('should pre-fill the full grant/deny motion order description when a docket clerk adds a docket entry', () => {
    createGrantDenyMotionCase().then(({ docketNumber }) => {
      createSignedGrantDenyMotionDraft(docketNumber);
      openAddDocketEntryForGrantDenyDraft(docketNumber);

      cy.get('[data-testid="court-issued-document-type-search"]').should(
        'have.text',
        'Order',
      );
      cy.get('[data-testid="document-description-input"]').should(
        'have.value',
        expectedDocumentDescription,
      );
      cy.get('[data-testid="docket-entry-preview-text"]').should(
        'have.text',
        `Docket entry preview: ${expectedDocumentDescription}`,
      );
    });
  });
});
