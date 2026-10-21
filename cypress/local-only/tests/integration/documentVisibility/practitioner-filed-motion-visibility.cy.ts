import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import {
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
import { logout } from '../../../../helpers/authentication/logout';

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

const verifyDocumentCannotBeViewed = (docketEntryId: string) => {
  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('not.exist');
    cy.wrap(row)
      .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
      .should('exist');
    cy.request({
      url: `http://localhost:4000/case-documents/102-26/${docketEntryId}/document-download-url`,
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
  primaryFilerName: string,
) => {
  cy.visit(`case-detail/${docketNumber}`);
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
  cy.get('#supporting-document-0').select('Brief');
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="supporting-document-file-0"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-supporting-document-file-0"]',
  });

  cy.get(`[data-testid="filingParty-${primaryFilerName}, Petitioner"]`).click();
  cy.get('[data-testid="file-document-submit-document"]').click();

  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
};

describe('Testing motion visibility after policy change date', () => {
  beforeEach(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: 'motion-visibility-policy-change-date',
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    const yesterday = formatDateString(
      calculateISODate({ howMuch: -1, units: 'days' }),
      'yyyy-MM-dd',
    );

    cy.task('toggleFeatureFlag', {
      flag: 'motion-visibility-policy-change-date',
      flagValue: yesterday,
    });
  });

  afterEach(function () {
    cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(ORIGINAL_FEATURE_FLAG_VALUE => {
      cy.task('toggleFeatureFlag', {
        flag: 'motion-visibility-policy-change-date',
        flagValue: ORIGINAL_FEATURE_FLAG_VALUE,
      });
    });
  });

  describe('Motion visibility for documents filed by a private practitioner', () => {
    let caseDocketNumber: string;
    const docketEntries: any = {};

    before(() => {
      const primaryFilerName = 'John';
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        caseDocketNumber = docketNumber;
        logout();
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
        loginAsPrivatePractitioner();
        fileAMotionAndSupportingDocuments(docketNumber, primaryFilerName);
        cy.visit(`case-detail/${docketNumber}`);
        cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
        cy.wait('@getDocketEntries').then(({ response }) => {
          const docketEntryList: PublicDocketEntry[] =
            response?.body.docketEntries;
          docketEntries.motionDocketEntry = docketEntryList.find(
            (entry: PublicDocketEntry) => entry.eventCode === 'M006',
          );
          docketEntries.briefDocketEntry = docketEntryList.find(
            (entry: PublicDocketEntry) => entry.eventCode === 'BRF',
          );
        });
      });
    });

    it('should let motion and supporting documents be downloadable from public site', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        docketEntries.motionDocketEntry.index,
      );
      // this won't work until the fix from 10399 is in
      // verifyDocumentCanBeViewedPublic(
      //   caseDocketNumber,
      //   docketEntries.briefDocketEntry.index,
      // );
    });

    it('should let motion and supporting documents be downloadable by petitioner not on case', () => {
      loginAsPetitioner();
      cy.visit(`case-detail/${caseDocketNumber}`);
      verifyDocumentCanBeViewed(docketEntries.motionDocketEntry.docketEntryId);
      // this won't work until the fix from 10399 is in
      // verifyDocumentCanBeViewed(docketEntries.briefDocketEntry.docketEntryId);
    });
  });

  xit('testing helper functions', () => {
    loginAsPetitioner();
    cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
    cy.visit('case-detail/102-26');
    cy.wait('@getDocketEntries').then(({ response }) => {
      const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
      const motionDocketEntry = docketEntries.find(
        (entry: PublicDocketEntry) => entry.eventCode === 'M218',
      );
      const memorandumDocketEntry = docketEntries.find(
        (entry: PublicDocketEntry) => entry.eventCode === 'MISP',
      );
      const briefDocketEntries = docketEntries
        .filter((entry: PublicDocketEntry) => entry.eventCode === 'BRF')
        .sort((a, b) => (a.index || 0) - (b.index || 0));
      verifyDocumentCanBeViewed(motionDocketEntry?.docketEntryId!);
      verifyDocumentCanBeViewed(briefDocketEntries[0]?.docketEntryId!);

      verifyDocumentCannotBeViewed(memorandumDocketEntry?.docketEntryId!);
      verifyDocumentCannotBeViewed(briefDocketEntries[1]?.docketEntryId!);

      verifyDocumentCanBeViewedPublic('102-26', motionDocketEntry?.index!);
      verifyDocumentCanBeViewedPublic('102-26', briefDocketEntries[0]?.index!);

      verifyDocumentCannotBeViewedPublic(
        '102-26',
        memorandumDocketEntry?.index!,
      );
      verifyDocumentCannotBeViewedPublic(
        '102-26',
        briefDocketEntries[1]?.index!,
      );
    });
  });
});
