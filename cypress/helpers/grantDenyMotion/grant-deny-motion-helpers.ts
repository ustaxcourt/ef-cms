import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { loginAsCaseServicesSupervisor } from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';

export type GrantDenyMotionCaseFixture = {
  docketNumber: string;
  motionDocketEntryId: string;
};

export const GRANT_DENY_MOTION_TYPE = 'Motion for Continuance';

export const grantDenyMotionToday = formatNow(FORMATS.MMDDYYYY);
export const grantDenyMotionFormattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);

export const createGrantDenyMotionCase = (
  motionType: string = GRANT_DENY_MOTION_TYPE,
): Cypress.Chainable<GrantDenyMotionCaseFixture> => {
  loginAsCaseServicesSupervisor();

  return createAndServePaperPetition({ yearReceived: '2025' }).then(
    ({ docketNumber }) => {
      loginAsCaseServicesSupervisor();
      cy.visit(`/case-detail/${docketNumber}`);

      return createAndServePaperFiling({
        dateReceived: grantDenyMotionToday,
        documentType: motionType,
      }).then(({ docketEntryId }) =>
        cy.wrap({
          docketNumber,
          motionDocketEntryId: docketEntryId,
        }),
      );
    },
  );
};

export const openGrantDenyMotionFromDocketRecord = (
  motionType: string = GRANT_DENY_MOTION_TYPE,
): void => {
  cy.get('#tab-document-view').click();
  cy.contains(motionType).click();
  cy.get('[data-testid="grant-deny-motion"]').should('be.visible').click();
  cy.get('#page-title').should('contain.text', 'Grant/Deny Motion');
};

export const openGrantDenyMotionFromMessage = (): void => {
  cy.get('[data-testid="grant-deny-motion"]').should('be.visible').click();
  cy.get('#page-title').should('contain.text', 'Grant/Deny Motion');
};
