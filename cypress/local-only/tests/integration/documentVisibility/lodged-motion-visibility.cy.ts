import { faker } from '@faker-js/faker';
import { loginAsPrivatePractitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { logout } from 'cypress/helpers/authentication/logout';
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  MotionVisibilityPublicDocketEntry,
  docketClerkCompletesSectionQcChangingLodgeToFile,
  fileMotionForLeave,
  getMotionForLeaveEntriesForCase,
  getPetitionerFilerTestId,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Motion visibility for Motion for Leave with lodged secondary', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
    cy.task('setAllowedTerminalIpAddresses', []);
  });

  describe('Motion for Leave to File with lodged secondary Motion for Continuance', () => {
    const primaryFilerName = faker.person.firstName();
    let caseDocketNumber: string;
    let motionForLeaveEntry: MotionVisibilityPublicDocketEntry;
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
          ({ motionForLeave, lodgedSecondary: lodgedSecondaryEntry }) => {
            motionForLeaveEntry = motionForLeave;
            lodgedSecondary = lodgedSecondaryEntry;
          },
        );
      });
    });

    it('should let public download Motion for Leave but not lodged secondary while filer and terminal user can open lodged secondary', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionForLeaveEntry.index,
        motionForLeaveEntry.docketEntryId,
      );
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        lodgedSecondary.index,
        lodgedSecondary.docketEntryId,
      );

      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          lodgedSecondary.index,
          lodgedSecondary.docketEntryId,
        );
      });

      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(lodgedSecondary.docketEntryId);
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
            docketClerkCompletesSectionQcChangingLodgeToFile(docketNumber);
          },
        );
      });
    });

    it('should let public download previously lodged secondary Motion for Continuance after Section QC de-lodge', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        lodgedSecondary.index,
        lodgedSecondary.docketEntryId,
      );
    });
  });
});
