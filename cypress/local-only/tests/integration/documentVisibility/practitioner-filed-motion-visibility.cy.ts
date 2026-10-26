import {
  loginAsDocketClerk1,
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import {
  calculateISODate,
  formatDateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { createAndServePaperFiling } from '../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import {
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  MotionVisibilityDocketEntries,
  MotionVisibilityPublicDocketEntry,
  UNAUTHORIZED_PETITIONER_EMAIL,
  createPetitionerCaseWithFiledMotion,
  createPrivatePractitionerCaseWithFiledMotion,
  externalViewerRolesForIrsPractitionerFiledMotion,
  externalViewerRolesForPrivatePractitionerFiledMotion,
  fileAMotionAndSupportingDocuments,
  fileIrsAnswer,
  getMotionVisibilityDocketEntriesForCase,
  getPaperMotionDocketEntryForCase,
  lodgeDocketEntryByEventCode,
  strikeDocketEntryByEventCode,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionNotViewableOnPublicSite,
  verifyMotionViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

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

    it('should let motion be downloadable from public site', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let brief in support be downloadable from public site', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let memorandum in support be downloadable from public site', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
    });

    externalViewerRolesForPrivatePractitionerFiledMotion.forEach(
      ({ login, role }) => {
        it(`should let motion be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
        });

        // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
        it.skip(`should let brief in support be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
        });

        // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
        it.skip(`should let memorandum in support be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(
            motionEntries.memorandaInSupport.docketEntryId,
          );
        });
      },
    );
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

    it('should let motion be downloadable from public site', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let brief in support be downloadable from public site', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let memorandum in support be downloadable from public site', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
    });

    externalViewerRolesForIrsPractitionerFiledMotion.forEach(
      ({ login, role }) => {
        it(`should let motion be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
        });

        // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
        it.skip(`should let brief in support be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
        });

        // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
        it.skip(`should let memorandum in support be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCanBeViewed(
            motionEntries.memorandaInSupport.docketEntryId,
          );
        });
      },
    );
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

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let brief in support be downloadable from public site', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let memorandum in support be downloadable from public site', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
    });

    externalViewerRolesForPrivatePractitionerFiledMotion.forEach(
      ({ login, role }) => {
        it(`should not let motion be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCannotBeViewed(
            caseDocketNumber,
            motionEntries.motion.docketEntryId,
          );
        });
      },
    );

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let brief in support be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.briefInSupport.docketEntryId,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let memorandum in support be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.memorandaInSupport.docketEntryId,
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

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let brief in support be downloadable from public site', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let memorandum in support be downloadable from public site', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
    });

    externalViewerRolesForPrivatePractitionerFiledMotion.forEach(
      ({ login, role }) => {
        it(`should not let motion be downloadable by ${role}`, () => {
          login();
          goToCase(caseDocketNumber);
          verifyDocumentCannotBeViewed(
            caseDocketNumber,
            motionEntries.motion.docketEntryId,
          );
        });
      },
    );

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let brief in support be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.briefInSupport.docketEntryId,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let memorandum in support be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.memorandaInSupport.docketEntryId,
      );
    });
  });

  describe('Stricken practitioner-filed motion', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          strikeDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
        },
      );
    });

    it('should not let stricken motion be downloadable from public site', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should not let stricken motion be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });
  });

  describe('Sealed practitioner-filed motion', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          cy.get(
            `[data-testid="seal-docket-entry-button-${entries.motion.index}"]`,
          ).click();
          cy.get('[data-testid="modal-button-confirm"]').click();
        },
      );
    });

    it('should not let sealed motion be downloadable from public site', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should not let sealed motion be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });
  });

  describe('Sealed case with practitioner-filed motion', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="seal-case-button"]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
        },
      );
    });

    it('should not let motion be downloadable from public site when case is sealed', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });
  });

  describe('Lodged practitioner-filed motion', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          lodgeDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
        },
      );
    });

    it('should not let lodged motion be downloadable from public site', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should let lodged motion be downloadable from public site for terminal user', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          motionEntries.motion.index,
        );
      });
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let brief in support be downloadable from public site when motion is lodged', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should not let memorandum in support be downloadable from public site when motion is lodged', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let brief in support be downloadable from public site for terminal user when motion is lodged', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          motionEntries.briefInSupport.index,
        );
      });
    });

    // TODO(10399): unskip once supporting-document visibility fix from 10399 is merged
    it.skip('should let memorandum in support be downloadable from public site for terminal user when motion is lodged', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          motionEntries.memorandaInSupport.index,
        );
      });
    });
  });

  describe('Paper-filed motion after policy change date', () => {
    let caseDocketNumber: string;
    let paperMotionEntry: MotionVisibilityPublicDocketEntry;

    before(() => {
      const today = formatNow(FORMATS.MMDDYYYY);

      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber }) => {
          caseDocketNumber = docketNumber;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          createAndServePaperFiling({
            dateReceived: today,
            documentType: 'Motion for Continuance',
            isPaperCase: false,
          });
          getPaperMotionDocketEntryForCase(docketNumber).then(entry => {
            paperMotionEntry = entry;
          });
        },
      );
    });

    it('should not let paper-filed motion be downloadable from public site', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        paperMotionEntry.index,
      );
    });
  });
});
