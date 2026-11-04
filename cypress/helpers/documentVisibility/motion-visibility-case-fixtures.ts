import { faker } from '@faker-js/faker';
import { loginAsPrivatePractitioner } from '../authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { logout } from '../authentication/logout';
import { fileAMotionAndSupportingDocuments } from './file-motion-visibility';
import { getMotionVisibilityDocketEntriesForCase } from './motion-visibility-docket-entry-helpers';
import { getPetitionerFilerTestId } from './motion-visibility-unassociated-roles';
import { MotionVisibilityCaseFixture } from './motion-visibility-types';

export function createPrivatePractitionerCaseWithFiledMotion(
  primaryFilerName: string = faker.person.firstName(),
): Cypress.Chainable<MotionVisibilityCaseFixture> {
  loginAsPrivatePractitioner();
  return externalUserCreatesElectronicCase(primaryFilerName).then(
    docketNumber => {
      logout();
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
      loginAsPrivatePractitioner();
      fileAMotionAndSupportingDocuments(
        docketNumber,
        getPetitionerFilerTestId(primaryFilerName),
      );
      return getMotionVisibilityDocketEntriesForCase(docketNumber).then(
        entries => ({
          docketNumber,
          entries,
        }),
      );
    },
  );
}

export function sealDocketEntryAtIndex(
  docketRecordIndex: number,
  sealTo: 'public' | 'external',
): void {
  cy.get(
    `[data-testid="seal-docket-entry-button-${docketRecordIndex}"]`,
  ).click();
  cy.get('[data-testid="seal-docket-entry-modal"]');
  if (sealTo === 'public') {
    cy.get('#docket-entry-sealed-to-public').click();
  } else {
    cy.get('#docket-entry-sealed-to-external').click();
  }
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}
