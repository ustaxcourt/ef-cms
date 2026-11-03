import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createConsolidatedGroupWithOneMember,
  fileConsolidatedMotionOnGroup,
  fileSupportInSupportOfMotionOnGroup,
  getEFiledMotionOnCase,
  getFilerTestIdForConsolidatedFiler,
  getMotionAndSupportingEntriesForCase,
  loginConsolidatedFiler,
  prepareConsolidatedFiler,
} from 'cypress/helpers/documentVisibility/consolidated-motion-visibility-helpers';
import {
  MotionVisibilityPublicDocketEntry,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToToday,
  setMotionVisibilityPolicyDateToTomorrow,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Consolidated group motion visibility smoke', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Private practitioner motion on consolidated group', () => {
    let leadDocketNumber: string;
    let memberDocketNumber: string;
    let leadMotionEntry: MotionVisibilityPublicDocketEntry;
    let memberMotionEntry: MotionVisibilityPublicDocketEntry;

    before(() => {
      createConsolidatedGroupWithOneMember().then(group => {
        ({ leadDocketNumber, memberDocketNumber } = group);
        prepareConsolidatedFiler('privatePractitioner', group);
        fileConsolidatedMotionOnGroup(
          leadDocketNumber,
          'privatePractitioner',
          group,
          {
            supportingDocs: [],
          },
        );
        getEFiledMotionOnCase(leadDocketNumber).then(motionEntry => {
          leadMotionEntry = motionEntry;
        });
        getEFiledMotionOnCase(memberDocketNumber).then(motionEntry => {
          memberMotionEntry = motionEntry;
        });
      });
    });

    it('should let filer open motion on lead and member cases', () => {
      loginConsolidatedFiler('privatePractitioner');
      goToCase(leadDocketNumber);
      verifyDocumentCanBeViewed(leadMotionEntry.docketEntryId);
      cy.visit('/');
      goToCase(memberDocketNumber);
      verifyDocumentCanBeViewed(memberMotionEntry.docketEntryId);
    });

    it('should let public download motion on lead and member cases', () => {
      verifyMotionViewableOnPublicSite(leadDocketNumber, leadMotionEntry);
      verifyMotionViewableOnPublicSite(memberDocketNumber, memberMotionEntry);
    });
  });

  describe('Later brief in support on consolidated group', () => {
    let leadDocketNumber: string;
    let memberDocketNumber: string;
    let leadMotionEntry: MotionVisibilityPublicDocketEntry;
    let memberMotionEntry: MotionVisibilityPublicDocketEntry;
    let leadSupportingEntry: MotionVisibilityPublicDocketEntry;
    let memberSupportingEntry: MotionVisibilityPublicDocketEntry;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      createConsolidatedGroupWithOneMember().then(group => {
        ({ leadDocketNumber, memberDocketNumber } = group);
        prepareConsolidatedFiler('privatePractitioner', group);

        setMotionVisibilityPolicyDateToTomorrow();
        fileConsolidatedMotionOnGroup(
          leadDocketNumber,
          'privatePractitioner',
          group,
          {
            supportingDocs: [],
          },
        );
        setMotionVisibilityPolicyDateToToday();

        loginConsolidatedFiler('privatePractitioner');
        fileSupportInSupportOfMotionOnGroup(leadDocketNumber, {
          documentType: 'Brief in Support',
          filerTestId: getFilerTestIdForConsolidatedFiler(
            'privatePractitioner',
            group,
          ),
        });

        getEFiledMotionOnCase(leadDocketNumber).then(motionEntry => {
          leadMotionEntry = motionEntry;
        });
        getEFiledMotionOnCase(memberDocketNumber).then(motionEntry => {
          memberMotionEntry = motionEntry;
        });

        getMotionAndSupportingEntriesForCase(leadDocketNumber).then(
          ({ supportingEntries }) => {
            const supportingEntry = supportingEntries.find(
              entry => entry.eventCode === 'BRF',
            );
            if (!supportingEntry) {
              throw new Error('Brief in Support was not found on lead case');
            }
            leadSupportingEntry = supportingEntry;
          },
        );
        getMotionAndSupportingEntriesForCase(memberDocketNumber).then(
          ({ supportingEntries }) => {
            const supportingEntry = supportingEntries.find(
              entry => entry.eventCode === 'BRF',
            );
            if (!supportingEntry) {
              throw new Error('Brief in Support was not found on member case');
            }
            memberSupportingEntry = supportingEntry;
          },
        );
      });
    });

    it('should let public download original motion on lead and member cases', () => {
      verifyMotionViewableOnPublicSite(leadDocketNumber, leadMotionEntry);
      verifyMotionViewableOnPublicSite(memberDocketNumber, memberMotionEntry);
    });

    it('should not let public download later brief in support on lead and member cases', () => {
      verifyDocumentCannotBeViewedPublic(
        leadDocketNumber,
        leadSupportingEntry.index,
        leadSupportingEntry.docketEntryId,
      );
      verifyDocumentCannotBeViewedPublic(
        memberDocketNumber,
        memberSupportingEntry.index,
        memberSupportingEntry.docketEntryId,
      );
    });

    it('should let terminal user download later brief in support on lead and member cases', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCanBeViewedPublic(
          leadDocketNumber,
          leadSupportingEntry.index,
          leadSupportingEntry.docketEntryId,
        );
        verifyDocumentCanBeViewedPublic(
          memberDocketNumber,
          memberSupportingEntry.index,
          memberSupportingEntry.docketEntryId,
        );
      });
    });
  });
});
