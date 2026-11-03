import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createCaseWithPaperFiledMotionDocuments,
  createCaseWithPetitionerFiledMotion,
} from 'cypress/helpers/documentVisibility/petitioner-paper-motion-visibility-helpers';
import {
  UNAUTHORIZED_PETITIONER_EMAIL,
  MotionVisibilityPublicDocketEntry,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCannotBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionNotViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Petitioner-filed and paper-filed motion visibility smoke', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Petitioner-filed motion after policy change date', () => {
    let caseDocketNumber: string;
    let motionEntry: MotionVisibilityPublicDocketEntry;

    before(() => {
      createCaseWithPetitionerFiledMotion({}).then(
        ({ docketNumber, motion }) => {
          caseDocketNumber = docketNumber;
          motionEntry = motion;
        },
      );
    });

    it('should not let public download petitioner-filed motion', () => {
      verifyMotionNotViewableOnPublicSite(caseDocketNumber, motionEntry);
    });

    it('should let filer open petitioner-filed motion', () => {
      loginAsPetitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntry.docketEntryId);
    });

    it('should not let unassociated petitioner download petitioner-filed motion', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(caseDocketNumber, motionEntry.docketEntryId);
    });
  });

  describe('Paper-filed motion after policy change date', () => {
    let caseDocketNumber: string;
    let paperMotionEntry: MotionVisibilityPublicDocketEntry;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      createCaseWithPaperFiledMotionDocuments({
        loginAsClerk: () => loginAsDocketClerk1(),
        party: 'respondent',
        expectedPaperEntryCount: 1,
      }).then(({ docketNumber, paperEntries }) => {
        caseDocketNumber = docketNumber;
        paperMotionEntry = paperEntries[0];
      });
    });

    it('should not let public download paper-filed motion', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        paperMotionEntry.index,
        paperMotionEntry.docketEntryId,
      );
    });

    it('should let terminal user open paper-filed motion', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          paperMotionEntry.index,
          paperMotionEntry.docketEntryId,
        );
      });
    });
  });
});
