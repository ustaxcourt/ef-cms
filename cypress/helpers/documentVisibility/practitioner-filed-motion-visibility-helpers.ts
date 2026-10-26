import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import {
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsIrsPractitioner1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../authentication/login-as-helpers';
import { downloadAndParsePdf } from '../../local-only/support/helpers';
import { getCypressEnv } from '../env/cypressEnvironment';
import { externalUserCreatesElectronicCase } from '../fileAPetition/petitioner-creates-electronic-case';
import { selectTypeaheadInput } from '../components/typeAhead/select-typeahead-input';
import { attachFile } from '../file/upload-file';
import { petitionsClerkQcsAndServesElectronicCase } from '../documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { petitionsClerkServesPetition } from '../documentQC/petitionsclerk-serves-petition';
import { goToCase } from '../caseDetail/go-to-case';
import { logout } from '../authentication/logout';
import { faker } from '@faker-js/faker';

export const MOTION_FOR_CONTINUANCE_EVENT_CODE = 'M006';
const BRIEF_IN_SUPPORT_EVENT_CODE = 'BRF';
const MEMORANDA_IN_SUPPORT_EVENT_CODE = 'MISP';
export const MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG =
  'motion-visibility-policy-change-date';
export const UNAUTHORIZED_PETITIONER_EMAIL = 'petitioner2@example.com';

export type MotionVisibilityPublicDocketEntry = {
  docketEntryId: string;
  index: number;
  eventCode?: string;
};

export type MotionVisibilityDocketEntries = {
  briefInSupport: MotionVisibilityPublicDocketEntry;
  memorandaInSupport: MotionVisibilityPublicDocketEntry;
  motion: MotionVisibilityPublicDocketEntry;
};

export type MotionVisibilityCaseFixture = {
  docketNumber: string;
  entries: MotionVisibilityDocketEntries;
};

export type ExternalViewerRole = {
  login: () => void;
  role: string;
};

export const externalViewerRolesForPrivatePractitionerFiledMotion: ExternalViewerRole[] =
  [
    {
      login: () => loginAsPetitioner(),
      role: 'petitioner not on case',
    },
    {
      login: () =>
        loginAsPrivatePractitioner('privatePractitioner2@example.com'),
      role: 'private practitioner not on case',
    },
    {
      login: () => loginAsIrsPractitioner(),
      role: 'IRS practitioner not on case',
    },
    {
      login: () => loginAsDojPractitioner(),
      role: 'DOJ practitioner not on case',
    },
  ];

export const externalViewerRolesForIrsPractitionerFiledMotion: ExternalViewerRole[] =
  [
    {
      login: () => loginAsPetitioner('petitioner2@example.com'),
      role: 'petitioner not on case',
    },
    {
      login: () => loginAsPrivatePractitioner(),
      role: 'private practitioner not on case',
    },
    {
      login: () => loginAsIrsPractitioner1(),
      role: 'IRS practitioner not on case',
    },
    {
      login: () => loginAsDojPractitioner(),
      role: 'DOJ practitioner not on case',
    },
  ];

const getPetitionerFilingPartyTestId = (primaryFilerName: string): string =>
  `filingParty-${primaryFilerName}, Petitioner`;

const getDocketEntryByEventCode = (
  docketEntries: PublicDocketEntry[],
  eventCode: string,
): MotionVisibilityPublicDocketEntry => {
  const docketEntry = docketEntries.find(
    entry => entry.eventCode === eventCode,
  );

  if (!docketEntry) {
    throw new Error(`Docket entry with event code ${eventCode} was not found`);
  }

  const { docketEntryId, index } = docketEntry;

  expect(docketEntryId).to.be.a('string');
  expect(index).to.be.a('number');

  if (docketEntryId === undefined || index === undefined) {
    throw new Error(`Docket entry ${eventCode} is missing id or index`);
  }

  return { docketEntryId, index, eventCode: docketEntry.eventCode };
};

const getPaperMotionDocketEntry = (
  docketEntries: PublicDocketEntry[],
): MotionVisibilityPublicDocketEntry => {
  const docketEntry = docketEntries.find(
    entry =>
      entry.eventCode === MOTION_FOR_CONTINUANCE_EVENT_CODE && entry.isPaper,
  );

  if (!docketEntry) {
    throw new Error('Paper motion docket entry was not found');
  }

  const { docketEntryId, index } = docketEntry;

  if (docketEntryId === undefined || index === undefined) {
    throw new Error('Paper motion docket entry is missing id or index');
  }

  return { docketEntryId, index, eventCode: docketEntry.eventCode };
};

const getMotionVisibilityDocketEntries = (
  docketEntries: PublicDocketEntry[],
): MotionVisibilityDocketEntries => {
  const briefInSupport = getDocketEntryByEventCode(
    docketEntries,
    BRIEF_IN_SUPPORT_EVENT_CODE,
  );
  const memorandaInSupport = getDocketEntryByEventCode(
    docketEntries,
    MEMORANDA_IN_SUPPORT_EVENT_CODE,
  );
  const motionDocketEntry = docketEntries.find(
    entry =>
      entry.eventCode === MOTION_FOR_CONTINUANCE_EVENT_CODE && !entry.isPaper,
  );

  if (!motionDocketEntry) {
    throw new Error(
      `E-filed docket entry with event code ${MOTION_FOR_CONTINUANCE_EVENT_CODE} was not found`,
    );
  }

  const { docketEntryId, index } = motionDocketEntry;

  if (docketEntryId === undefined || index === undefined) {
    throw new Error(
      `E-filed docket entry ${MOTION_FOR_CONTINUANCE_EVENT_CODE} is missing id or index`,
    );
  }

  const motion: MotionVisibilityPublicDocketEntry = {
    docketEntryId,
    index,
    eventCode: motionDocketEntry.eventCode,
  };

  expect(briefInSupport.eventCode).to.eq(BRIEF_IN_SUPPORT_EVENT_CODE);
  expect(memorandaInSupport.eventCode).to.eq(MEMORANDA_IN_SUPPORT_EVENT_CODE);

  return { briefInSupport, memorandaInSupport, motion };
};

export function getMotionVisibilityDocketEntriesForCase(
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityDocketEntries> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getMotionVisibilityDocketEntries(docketEntries);
  });
}

export function getPaperMotionDocketEntryForCase(
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getPaperMotionDocketEntry(docketEntries);
  });
}

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
        getPetitionerFilingPartyTestId(primaryFilerName),
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

export function createPetitionerCaseWithFiledMotion(
  primaryFilerName: string = faker.person.firstName(),
): Cypress.Chainable<MotionVisibilityCaseFixture> {
  loginAsPetitioner();
  return externalUserCreatesElectronicCase(primaryFilerName).then(
    docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPetitioner();
      fileAMotionAndSupportingDocuments(
        docketNumber,
        getPetitionerFilingPartyTestId(primaryFilerName),
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

export function fileIrsAnswer(docketNumber: string): void {
  loginAsIrsPractitioner();
  goToCase(docketNumber);
  cy.get('[data-testid="button-first-irs-document"]').click();
  selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
  cy.get('[data-testid="submit-document"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}

export function strikeDocketEntryByEventCode(eventCode: string): void {
  cy.get(`[data-testid="edit-${eventCode}"]`).click();
  cy.get('[data-testid="tab-action"]').click();
  cy.get('[data-testid="strike-entry"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
}

export function lodgeDocketEntryByEventCode(eventCode: string): void {
  cy.get(`[data-testid="edit-${eventCode}"]`).click();
  cy.get('#filing-status-Lodge').click();
  cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
}

export function verifyMotionNotViewableOnPublicSite(
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void {
  verifyDocumentCannotBeViewedPublic(docketNumber, motion.index);
}

export function verifyMotionViewableOnPublicSite(
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void {
  verifyDocumentCanBeViewedPublic(docketNumber, motion.index);
}

export function verifyDocumentCanBeViewed(docketEntryId: string): void {
  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('exist');
    downloadAndParsePdf({
      element: cy.wrap(row).find('[data-testid^="document-download-link-"]'),
    });
  });
}

export function verifyDocumentCannotBeViewed(
  docketNumber: string,
  docketEntryId: string,
): void {
  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('not.exist');
    cy.wrap(row)
      .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
      .should('exist');
    cy.request({
      url: `http://localhost:4000/case-documents/${docketNumber}/${docketEntryId}/document-download-url`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(403);
    });
  });
}

export function verifyDocumentCanBeViewedPublic(
  docketNumber: string,
  docketEntryIndex: number,
): void {
  const { publicSiteUrl } = getCypressEnv();

  cy.origin(
    publicSiteUrl,
    {
      args: {
        docketNumber,
        publicSiteUrl,
        docketEntryIndex,
      },
    },
    ({ docketNumber: dn, publicSiteUrl: url, docketEntryIndex: index }) => {
      cy.intercept('GET', '**/public-api/**/public-document-download-url').as(
        'publicDownload',
      );

      cy.visit(`${url}/case-detail/${dn}`);

      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get(`[data-testid="public-docket-record-no-${index}"]`)
        .find('[data-testid="Filing-and-Proceedings-link-to-docket-entry"]')
        .should('exist')
        .click();

      cy.wait('@publicDownload').then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
      });
    },
  );
}

export function verifyDocumentCannotBeViewedPublic(
  docketNumber: string,
  docketEntryIndex: number,
): void {
  const { publicSiteUrl } = getCypressEnv();

  cy.origin(
    publicSiteUrl,
    {
      args: {
        docketNumber,
        publicSiteUrl,
        docketEntryIndex,
      },
    },
    ({ docketNumber: dn, publicSiteUrl: url, docketEntryIndex: index }) => {
      cy.visit(`${url}/case-detail/${dn}`);
      cy.get(`[data-testid="public-docket-record-no-${index}"]`).then(row => {
        cy.wrap(row)
          .find('[data-testid="Filing-and-Proceedings-link-to-docket-entry"]')
          .should('not.exist');
        cy.wrap(row)
          .find('[data-label="Filings and Proceedings"]')
          .should('exist');
      });
    },
  );
}

export function fileAMotionAndSupportingDocuments(
  docketNumber: string,
  filingPartyTestId: string,
): void {
  goToCase(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();

  selectTypeaheadInput(
    'complete-doc-document-type-search',
    'Motion for Continuance',
  );
  cy.get('[data-testid="submit-document"]').click();

  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });

  cy.get('[data-testid="primaryDocument-objections-No"]').click();

  cy.get('#add-supporting-document-button').click();
  cy.get('#supporting-document-0').select('Brief in Support');
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="supporting-document-file-0"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-supporting-document-file-0"]',
  });

  cy.get('#add-supporting-document-button').click();
  cy.get('#supporting-document-1').select('Memorandum in Support');
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="supporting-document-file-1"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-supporting-document-file-1"]',
  });

  cy.get(`[data-testid="${filingPartyTestId}"]`).click();
  cy.get('[data-testid="file-document-submit-document"]').click();

  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}
