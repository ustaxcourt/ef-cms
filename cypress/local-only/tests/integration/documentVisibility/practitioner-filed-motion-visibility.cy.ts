import { faker } from '@faker-js/faker';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { logout } from 'cypress/helpers/authentication/logout';
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  BRIEF_IN_SUPPORT_EVENT_CODE,
  MEMORANDA_IN_SUPPORT_EVENT_CODE,
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MotionVisibilityDocketEntries,
  MotionVisibilityPublicDocketEntry,
  UNAUTHORIZED_PETITIONER_EMAIL,
  createPrivatePractitionerCaseWithFiledMotion,
  setDocketEntryFilingStatusByEventCode,
  getPetitionerFilerTestId,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToTomorrow,
  setMotionVisibilityPolicyDateToYesterday,
  fileBriefInSupportOfMotion,
  fileMotionOnly,
  getBriefInSupportEntryForCase,
  getEFiledMotionEntryForCase,
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
  qcDocument,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';

describe('Practitioner-filed motion visibility smoke', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('After motion visibility policy change date', () => {
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

    it('should let public download practitioner motion brief and memorandum in support', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
        motionEntries.briefInSupport.docketEntryId,
      );
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
        motionEntries.memorandaInSupport.docketEntryId,
      );
    });

    it('should let unassociated petitioner download practitioner motion brief and memorandum in support', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
      verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
      verifyDocumentCanBeViewed(motionEntries.memorandaInSupport.docketEntryId);
    });
  });

  describe('Before motion visibility policy change date', () => {
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
      setMotionVisibilityPolicyDateToTomorrow();
    });

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    it('should not let public download practitioner motion brief or memorandum in support', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
        motionEntries.briefInSupport.docketEntryId,
      );
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
        motionEntries.memorandaInSupport.docketEntryId,
      );
    });

    it('should let filer and terminal user open practitioner motion filed before policy change date', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);

      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          motionEntries.motion.index,
          motionEntries.motion.docketEntryId,
        );
      });
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
          qcDocument(docketNumber);
          goToCase(docketNumber);
          strikeDocketEntryByEventCode(MOTION_FOR_CONTINUANCE_EVENT_CODE);
        },
      );
    });

    it('should not let public or unassociated petitioner download stricken motion', () => {
      verifyMotionNotViewableOnPublicSite(
        caseDocketNumber,
        motionEntries.motion,
      );
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });

    it('should show stricken label and no download link for filer or terminal user', () => {
      loginAsDocketClerk1();
      goToCase(caseDocketNumber);
      verifyStrickenDocketEntry(motionEntries.motion.docketEntryId);

      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        loginAsPrivatePractitioner();
        goToCase(caseDocketNumber);
        verifyDocumentRowHasNoDownloadLink(motionEntries.motion.docketEntryId);
      });
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

    it('should not let public download motion when case is sealed', () => {
      const { publicSiteUrl, publicApiUrl } = getCypressEnv();
      cy.origin(
        publicSiteUrl,
        {
          args: {
            docketNumber: caseDocketNumber,
            publicSiteUrl,
            publicApiUrl,
            docketEntryId: motionEntries.motion.docketEntryId,
          },
        },
        ({
          docketNumber: dn,
          publicSiteUrl: url,
          publicApiUrl: apiUrl,
          docketEntryId: id,
        }) => {
          cy.visit(`${url}/case-detail/${dn}`);
          cy.get('.sealed-banner').should(
            'contain.text',
            'This case is sealed',
          );
          cy.get('[data-testid="table-public-docket-record"]').should(
            'not.exist',
          );
          cy.request({
            url: `${apiUrl}/public-api/${dn}/${id}/public-document-download-url`,
            failOnStatusCode: false,
          }).then(response => {
            expect(response.status).to.eq(403);
          });
        },
      );
    });
  });

  describe('Later brief in support of an existing practitioner-filed motion', () => {
    const primaryFilerName = faker.person.firstName();
    const filerTestId = getPetitionerFilerTestId(primaryFilerName);
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
        fileMotionOnly(docketNumber, filerTestId);
        getEFiledMotionEntryForCase(docketNumber).then(motion => {
          motionEntry = motion;
          loginAsDocketClerk1();
          setDocketEntryFilingDateToYesterday(docketNumber, motion.index);
          loginAsPrivatePractitioner();
          fileBriefInSupportOfMotion(docketNumber, filerTestId);
          getBriefInSupportEntryForCase(docketNumber).then(brief => {
            briefEntry = brief;
          });
        });
      });
    });

    it('should let public download original motion but not later brief in support', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntry);
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        briefEntry.index,
        briefEntry.docketEntryId,
      );
    });

    it('should let filer and terminal user open later brief in support', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(briefEntry.docketEntryId);

      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          caseDocketNumber,
          briefEntry.index,
          briefEntry.docketEntryId,
        );
      });
    });
  });

  describe('Metadata de-lodge of practitioner motion with supporting documents', () => {
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
          lodgeDocketEntryByEventCode(BRIEF_IN_SUPPORT_EVENT_CODE);
          lodgeDocketEntryByEventCode(MEMORANDA_IN_SUPPORT_EVENT_CODE);
          setDocketEntryFilingStatusByEventCode(
            MOTION_FOR_CONTINUANCE_EVENT_CODE,
          );
          setDocketEntryFilingStatusByEventCode(BRIEF_IN_SUPPORT_EVENT_CODE);
          setDocketEntryFilingStatusByEventCode(
            MEMORANDA_IN_SUPPORT_EVENT_CODE,
          );
        },
      );
    });

    it('should let public download practitioner motion brief and memorandum after metadata de-lodge', () => {
      verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
        motionEntries.briefInSupport.docketEntryId,
      );
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
        motionEntries.memorandaInSupport.docketEntryId,
      );
    });
  });
});
