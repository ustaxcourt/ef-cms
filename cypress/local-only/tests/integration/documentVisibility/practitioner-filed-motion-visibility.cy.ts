import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import {
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsIrsPractitioner1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { downloadAndParsePdf } from '../../../support/helpers';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import {
  calculateISODate,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { attachFile } from '../../../../helpers/file/upload-file';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { logout } from '../../../../helpers/authentication/logout';
import { faker } from '@faker-js/faker';

const MOTION_FOR_CONTINUANCE_EVENT_CODE = 'M006';
const BRIEF_IN_SUPPORT_EVENT_CODE = 'BRF';
const MEMORANDA_IN_SUPPORT_EVENT_CODE = 'MISP';
const MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG =
  'motion-visibility-policy-change-date';
const UNAUTHORIZED_PETITIONER_EMAIL = 'petitioner2@example.com';

type MotionVisibilityPublicDocketEntry = {
  docketEntryId: string;
  index: number;
  eventCode?: string;
};

type MotionVisibilityDocketEntries = {
  briefInSupport: MotionVisibilityPublicDocketEntry;
  memorandaInSupport: MotionVisibilityPublicDocketEntry;
  motion: MotionVisibilityPublicDocketEntry;
};

type MotionVisibilityCaseFixture = {
  docketNumber: string;
  entries: MotionVisibilityDocketEntries;
};

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
  const motion = getDocketEntryByEventCode(
    docketEntries,
    MOTION_FOR_CONTINUANCE_EVENT_CODE,
  );

  expect(briefInSupport.eventCode).to.eq(BRIEF_IN_SUPPORT_EVENT_CODE);
  expect(memorandaInSupport.eventCode).to.eq(MEMORANDA_IN_SUPPORT_EVENT_CODE);

  return { briefInSupport, memorandaInSupport, motion };
};

const getMotionVisibilityDocketEntriesForCase = (
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityDocketEntries> => {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getMotionVisibilityDocketEntries(docketEntries);
  });
};

const createPrivatePractitionerCaseWithFiledMotion = (
  primaryFilerName: string = faker.person.firstName(),
): Cypress.Chainable<MotionVisibilityCaseFixture> => {
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
};

const createPetitionerCaseWithFiledMotion = (
  primaryFilerName: string = faker.person.firstName(),
): Cypress.Chainable<MotionVisibilityCaseFixture> => {
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
};

const fileIrsAnswer = (docketNumber: string): void => {
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
};

const verifyMotionNotViewableOnPublicSite = (
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void => {
  verifyDocumentCannotBeViewedPublic(docketNumber, motion.index);
  // this won't work until the fix from 10399 is in
  // verifyDocumentCannotBeViewedPublic(docketNumber, briefInSupport.index);
};

const verifyMotionNotViewableByUnassociatedPetitioner = (
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void => {
  loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
  goToCase(docketNumber);
  verifyDocumentCannotBeViewed(docketNumber, motion.docketEntryId);
  // this won't work until the fix from 10399 is in
  // verifyDocumentCannotBeViewed(briefInSupport.docketEntryId);
};

const verifyMotionViewableOnPublicSite = (
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void => {
  verifyDocumentCanBeViewedPublic(docketNumber, motion.index);
  // this won't work until the fix from 10399 is in
  // verifyDocumentCanBeViewedPublic(docketNumber, briefInSupport.index);
};

const verifyDocumentCanBeViewed = (docketEntryId: string) => {
  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('exist');
    downloadAndParsePdf({
      element: cy.wrap(row).find('[data-testid^="document-download-link-"]'),
    });
  });
};

const verifyDocumentCannotBeViewed = (
  docketNumber: string,
  docketEntryId: string,
) => {
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
};

const verifyDocumentCanBeViewedPublic = (
  docketNumber: string,
  docketEntryIndex: number,
) => {
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
          .should('exist');
      });
    },
  );
};

const verifyDocumentCannotBeViewedPublic = (
  docketNumber: string,
  docketEntryIndex: number,
) => {
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
};

const fileAMotionAndSupportingDocuments = (
  docketNumber: string,
  filingPartyTestId: string,
) => {
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
};

describe('Testing motion visibility after policy change date', () => {
  beforeEach(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    const yesterday = formatDateString(
      calculateISODate({ howMuch: -1, units: 'days' }),
      'yyyy-MM-dd',
    );

    cy.task('toggleFeatureFlag', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
      flagValue: yesterday,
    });
  });

  afterEach(function () {
    cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(ORIGINAL_FEATURE_FLAG_VALUE => {
      cy.task('toggleFeatureFlag', {
        flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
        flagValue: ORIGINAL_FEATURE_FLAG_VALUE,
      });
    });
  });

  describe('Motion visibility for documents filed by a private practitioner', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
        },
      );
    });

    it('should let motion and supporting documents be downloadable from public site', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    });

    const roles = [
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

    roles.forEach(({ login, role }) => {
      it(`should let motion be downloadable by ${role}`, () => {
        login();
        goToCase(caseDocketNumber);
        verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
        // this won't work until the fix from 10399 is in
        // verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
      });
    });
  });

  describe('Motion visibility for documents filed by an IRS practitioner', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        caseDocketNumber = docketNumber;
        petitionsClerkServesPetition(docketNumber);
        fileIrsAnswer(docketNumber);
        loginAsIrsPractitioner();
        fileAMotionAndSupportingDocuments(
          docketNumber,
          'party-irs-practitioner-label',
        );
        getMotionVisibilityDocketEntriesForCase(docketNumber).then(entries => {
          motionEntries = entries;
        });
      });
    });

    it('should let motion and supporting documents be downloadable from public site', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    });

    const roles = [
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

    roles.forEach(({ login, role }) => {
      it(`should let motion be downloadable by ${role}`, () => {
        login();
        goToCase(caseDocketNumber);
        verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
        // this won't work until the fix from 10399 is in
        // verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
      });
    });
  });

  describe('Motion visibility for practitioner-filed motions before policy change date', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
        },
      );
    });

    beforeEach(() => {
      const tomorrow = formatDateString(
        calculateISODate({ howMuch: 1, units: 'days' }),
        'yyyy-MM-dd',
      );

      cy.task('toggleFeatureFlag', {
        flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
        flagValue: tomorrow,
      });
    });

    it('should not let motion be downloadable from public site', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should not let motion be downloadable by unassociated petitioner', () => {
      verifyMotionNotViewableByUnassociatedPetitioner(
        caseDocketNumber,
        motionEntries.motion,
      );
    });
  });

  describe('Motion visibility for documents filed by a petitioner after policy change date', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPetitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
        },
      );
    });

    it('should not let motion be downloadable from public site', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should not let motion be downloadable by unassociated petitioner', () => {
      verifyMotionNotViewableByUnassociatedPetitioner(
        caseDocketNumber,
        motionEntries.motion,
      );
    });
  });
});
