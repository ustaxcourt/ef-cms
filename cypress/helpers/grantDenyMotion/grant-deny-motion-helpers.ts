import {
  FORMATS,
  formatNow,
  getCurrentDateTimeInMillis,
} from '@shared/business/utilities/DateHandler';
import {
  externalUserCreatesElectronicCase,
  petitionerCreatesElectronicCaseWithSpouse,
} from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { attachFile } from 'cypress/helpers/file/upload-file';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

export type GrantDenyMotionCaseFixture = {
  docketNumber: string;
  motionDocketEntryId: string;
};

export type ElectronicMotionCaseFixture = {
  docketNumber: string;
  petitionerNames: string[];
};

export type MotionFilingParties = {
  filedByPetitioners?: boolean;
  filedByRespondent?: boolean;
  otherFilingParty?: string;
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

export const dismissPaperServiceNotice = (): void => {
  cy.get('[data-testid="print-paper-service-done-button"]').click();
};

const addAndServeMotion = ({
  filedByPetitioners,
  filedByRespondent,
  motionType,
  otherFilingParty,
}: MotionFilingParties & { motionType: string }): void => {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-paper-filing"]').click();
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
  ).type(grantDenyMotionToday);
  selectTypeaheadInput('primary-document-type-search', motionType);
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#primaryDocumentFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  if (filedByPetitioners) {
    cy.get('[data-testid="filed-by-option"]').click({ multiple: true });
  }

  if (filedByRespondent) {
    cy.get('label[for="party-irs-practitioner"]').click();
    cy.get('#party-irs-practitioner').should('be.checked');
  }

  if (otherFilingParty) {
    cy.get('label[for="has-other-filing-party"]').click();
    cy.get('#has-other-filing-party').should('be.checked');
    cy.get('#other-filing-party').type(otherFilingParty);
  }

  cy.get('[data-testid="objections-No"]').click();

  cy.intercept('GET', '**/documents/**/upload-policy').as('uploadPolicy');
  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  dismissPaperServiceNotice();
  cy.wait('@uploadPolicy');
};

/**
 * Creates a served electronic case with a single petitioner (or a petitioner and spouse when
 * `withSpouse` is set) and serves a motion on it filed by the requested combination of parties.
 */
export const createElectronicMotionCase = ({
  filedByPetitioners = true,
  filedByRespondent = false,
  motionType = GRANT_DENY_MOTION_TYPE,
  otherFilingParty,
  withSpouse = false,
}: MotionFilingParties & {
  motionType?: string;
  withSpouse?: boolean;
}): Cypress.Chainable<ElectronicMotionCaseFixture> => {
  const uniqueSuffix = getCurrentDateTimeInMillis();
  const name = `Person One ${uniqueSuffix}`;
  const spouseName = `Person One-Spouse ${uniqueSuffix}`;

  loginAsPetitioner();

  const caseCreated = withSpouse
    ? petitionerCreatesElectronicCaseWithSpouse(name, spouseName)
    : externalUserCreatesElectronicCase(name);

  return caseCreated.then(docketNumber => {
    petitionsClerkServesPetition(docketNumber);

    loginAsCaseServicesSupervisor();
    cy.visit(`/case-detail/${docketNumber}`);

    addAndServeMotion({
      filedByPetitioners,
      filedByRespondent,
      motionType,
      otherFilingParty,
    });

    return cy.wrap<ElectronicMotionCaseFixture>({
      docketNumber,
      petitionerNames: withSpouse ? [name, spouseName] : [name],
    });
  });
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

/**
 * Opens the served motion as the judge, selects GRANTED, and submits the draft order.
 * Callers wait on the aliased `@courtIssuedOrder` request to assert the generated order HTML.
 */
export const grantMotionAsJudge = (
  docketNumber: string,
  motionType: string = GRANT_DENY_MOTION_TYPE,
): void => {
  loginAsColvin();
  cy.visit(`/case-detail/${docketNumber}`);
  openGrantDenyMotionFromDocketRecord(motionType);

  cy.get('[data-testid="motion-disposition-GRANTED"]').click({ force: true });
  cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.checked');

  cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
  cy.get('[data-testid="save-draft-button"]').click();
};
