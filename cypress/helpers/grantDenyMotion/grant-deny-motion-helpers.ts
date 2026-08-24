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

export const GRANT_DENY_OTHER_FILING_PARTY = 'Chamber Of Commerce';

/**
 * The description the application generates for a granted motion's draft order.
 */
export const grantedOrderDescription = (
  motionType: string = GRANT_DENY_MOTION_TYPE,
): string => `Order - ${motionType} is granted`;

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
  hasPaperServiceParty,
  motionType,
  otherFilingParty,
}: MotionFilingParties & {
  hasPaperServiceParty: boolean;
  motionType: string;
}): void => {
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

  // The paper service printout only renders when a party is served on paper, so
  // a case whose parties are all electronic goes straight back to case detail.
  if (hasPaperServiceParty) {
    dismissPaperServiceNotice();
  }

  cy.wait('@uploadPolicy');

  // Serving a paper filing finishes asynchronously, and clicking through the
  // paper service printout was what used to hold the test until it did. Wait
  // for the motion to reach the docket record so every caller gets a case the
  // motion is actually filed on.
  cy.get('[data-testid="tab-docket-record"]').click();
  cy.contains(motionType).should('be.visible');
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
      // the spouse is added by the petitioner without an email, so they are the
      // only party on these cases that receives paper service
      hasPaperServiceParty: withSpouse,
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

/**
 * Grants the served motion as the judge, hands the generated order HTML to the
 * caller to assert on, then skips signing and confirms the draft order landed
 * on the Drafts tab.
 */
export const grantMotionAndAssertOrderHtml = ({
  assertOrderHtml,
  docketNumber,
  motionType = GRANT_DENY_MOTION_TYPE,
}: {
  assertOrderHtml: (html: string) => void;
  docketNumber: string;
  motionType?: string;
}): void => {
  grantMotionAsJudge(docketNumber, motionType);

  cy.wait('@courtIssuedOrder').then(({ request }) => {
    assertOrderHtml(request.body.contentHtml);
  });

  cy.contains('Apply Signature').should('exist');
  cy.get('[data-testid="skip-signature-button"]').click();

  cy.url().should('contain', `/case-detail/${docketNumber}`);
  cy.get('[data-testid="tab-drafts"]').click();
  cy.contains(grantedOrderDescription(motionType)).should('be.visible');
};
