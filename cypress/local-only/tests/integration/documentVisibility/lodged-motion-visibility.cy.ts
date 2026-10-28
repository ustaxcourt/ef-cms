import { faker } from '@faker-js/faker';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { logout } from 'cypress/helpers/authentication/logout';
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  MotionVisibilityPublicDocketEntry,
  UNAUTHORIZED_PETITIONER_EMAIL,
  docketClerkCompletesSectionQcChangingLodgeToFile,
  fileMotionForLeave,
  getMotionForLeaveEntriesForCase,
  getPetitionerFilerTestId,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Motion visibility for Motion for Leave with lodged secondary', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Motion for Leave to File with lodged secondary Motion for Continuance', () => {
    const primaryFilerName = faker.person.firstName();
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
          getPetitionerFilerTestId(primaryFilerName),
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

  describe('Section QC de-lodge of practitioner Motion for Leave lodged secondary after policy change date', () => {
    const primaryFilerName = faker.person.firstName();
    let caseDocketNumber: string;
    let lodgedSecondary: MotionVisibilityPublicDocketEntry;

    before(() => {
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        caseDocketNumber = docketNumber;
        logout();
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
        loginAsPrivatePractitioner();
        fileMotionForLeave(
          docketNumber,
          getPetitionerFilerTestId(primaryFilerName),
        );
        getMotionForLeaveEntriesForCase(docketNumber).then(
          ({ lodgedSecondary: lodgedSecondaryEntry }) => {
            lodgedSecondary = lodgedSecondaryEntry;
            docketClerkCompletesSectionQcChangingLodgeToFile(
              docketNumber,
              'Motion for Continuance',
            );
          },
        );
      });
    });

    it('should let public download previously lodged secondary Motion for Continuance after Section QC de-lodge', () => {
      verifyDocumentCanBeViewedPublic(caseDocketNumber, lodgedSecondary.index);
    });

    it('should let filer open previously lodged secondary Motion for Continuance after Section QC de-lodge', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(lodgedSecondary.docketEntryId);
    });
  });
});
