import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  MotionVisibilityPublicDocketEntry,
  UNAUTHORIZED_PETITIONER_EMAIL,
  fileMotionForLeave,
  getMotionForLeaveEntriesForCase,
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  restoreMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Motion visibility — Motion for Leave with lodged secondary', () => {
  beforeEach(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Motion for Leave to File with lodged secondary Motion for Continuance', () => {
    const primaryFilerName = 'LeaveLodgedFiler';
    let caseDocketNumber: string;
    let motionForLeaveEntry: MotionVisibilityPublicDocketEntry;
    let lodgedSecondary: MotionVisibilityPublicDocketEntry;

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
        fileMotionForLeave(
          docketNumber,
          `filingParty-${primaryFilerName}, Petitioner`,
        );
        getMotionForLeaveEntriesForCase(docketNumber).then(
          ({ motionForLeave, lodgedSecondary: lodgedSecondaryEntry }) => {
            motionForLeaveEntry = motionForLeave;
            lodgedSecondary = lodgedSecondaryEntry;
          },
        );
      });
    });

    it('should let public download Motion for Leave to File', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionForLeaveEntry.index,
      );
    });

    it('should not let public download lodged secondary Motion for Continuance', () => {
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        lodgedSecondary.index,
      );
    });

    it('should not let unassociated petitioner download lodged secondary Motion for Continuance', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        lodgedSecondary.docketEntryId,
      );
    });

    it('should let filer open lodged secondary Motion for Continuance', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(lodgedSecondary.docketEntryId);
    });

    it('should let terminal user open lodged secondary Motion for Continuance', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          lodgedSecondary.index,
        );
      });
    });
  });
});
