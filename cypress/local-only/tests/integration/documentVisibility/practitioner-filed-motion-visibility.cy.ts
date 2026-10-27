import {
  loginAsDocketClerk1,
  loginAsIrsPractitioner,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import {
  calculateISODate,
  formatDateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
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
  fileDocketEntryByEventCode,
  externalViewerRolesForIrsPractitionerFiledMotion,
  externalViewerRolesForPrivatePractitionerFiledMotion,
  fileAMotionAndSupportingDocuments,
  fileBriefInSupportOfMotion,
  fileIrsAnswer,
  fileMotionOnly,
  getBriefInSupportEntryForCase,
  getEFiledMotionEntryForCase,
  getMotionVisibilityDocketEntriesForCase,
  getPaperMotionDocketEntryForCase,
  lodgeDocketEntryByEventCode,
  setDocketEntryFilingDateToYesterday,
  strikeDocketEntryByEventCode,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
  verifyDocumentRowHasNoDownloadLink,
  verifyMotionNotViewableOnPublicSite,
  verifyMotionViewableOnPublicSite,
  verifyStrickenDocketEntry,
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

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    it('should let filer open motion filed before policy change date', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
    });

    it('should let filer open brief in support filed before policy change date', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
    });

    it('should let filer open memorandum in support filed before policy change date', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.memorandaInSupport.docketEntryId);
    });

    it('should let terminal user open motion filed before policy change date', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          motionEntries.motion.index,
        );
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

    it('should let filer open motion filed by petitioner after policy change date', () => {
      loginAsPetitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
    });

    it('should let filer open brief in support filed by petitioner after policy change date', () => {
      loginAsPetitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
    });

    it('should let filer open memorandum in support filed by petitioner after policy change date', () => {
      loginAsPetitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.memorandaInSupport.docketEntryId);
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

    it('should show stricken label on stricken practitioner-filed motion', () => {
      loginAsDocketClerk1();
      goToCase(caseDocketNumber);
      verifyStrickenDocketEntry(motionEntries.motion.docketEntryId);
    });

    it('should not show download link for stricken motion to filer', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentRowHasNoDownloadLink(motionEntries.motion.docketEntryId);
    });

    it('should not show download link for stricken motion to terminal user', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        loginAsPrivatePractitioner();
        goToCase(caseDocketNumber);
        verifyDocumentRowHasNoDownloadLink(motionEntries.motion.docketEntryId);
      });
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

    it('should let filer open lodged practitioner-filed motion', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
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

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

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

    it('should not let paper-filed motion be downloadable by unassociated petitioner', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        paperMotionEntry.docketEntryId,
      );
    });

    it('should let terminal user open paper-filed motion', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          paperMotionEntry.index,
        );
      });
    });
  });

  describe('Metadata de-lodge of practitioner motion filed after policy change date', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          lodgeDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
          fileDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
        },
      );
    });

    it('should let public download practitioner motion after metadata de-lodge', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    });
  });

  describe('Metadata de-lodge of petitioner motion filed after policy change date', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPetitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          lodgeDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
          fileDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
        },
      );
    });

    it('should not let public download petitioner motion after metadata de-lodge', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
    });

    it('should let filer open petitioner motion after metadata de-lodge', () => {
      loginAsPetitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
    });
  });

  describe('Later brief in support of an existing practitioner-filed motion', () => {
    const primaryFilerName = 'LaterBriefFiler';
    let caseDocketNumber: string;
    let motionEntry: MotionVisibilityPublicDocketEntry;
    let briefEntry: MotionVisibilityPublicDocketEntry;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        caseDocketNumber = docketNumber;
        logout();
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
        loginAsPrivatePractitioner();
        fileMotionOnly(
          docketNumber,
          `filingParty-${primaryFilerName}, Petitioner`,
        );
        getEFiledMotionEntryForCase(docketNumber).then(motion => {
          motionEntry = motion;
          loginAsDocketClerk1();
          setDocketEntryFilingDateToYesterday(docketNumber, motion.index);
          loginAsPrivatePractitioner();
          fileBriefInSupportOfMotion(
            docketNumber,
            `filingParty-${primaryFilerName}, Petitioner`,
          );
          getBriefInSupportEntryForCase(docketNumber).then(brief => {
            briefEntry = brief;
          });
        });
      });
    });

    it('should let public download original motion after later brief is filed', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntry);
    });

    it('should not let public download later brief in support', () => {
      verifyDocumentCannotBeViewedPublic(caseDocketNumber, briefEntry.index);
    });

    it('should not let unassociated petitioner download later brief in support', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(caseDocketNumber, briefEntry.docketEntryId);
    });

    it('should let filer open later brief in support', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(briefEntry.docketEntryId);
    });

    it('should let terminal user open later brief in support', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(caseDocketNumber, briefEntry.index);
      });
    });
  });
});
