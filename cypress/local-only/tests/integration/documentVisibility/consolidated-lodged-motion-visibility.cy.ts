import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createConsolidatedGroupWithOneMember,
  fileLeaveWithLodgedSecondaryOnGroup,
  getFilerTestIdForConsolidatedFiler,
  loginConsolidatedFiler,
  prepareConsolidatedFiler,
} from 'cypress/helpers/documentVisibility/consolidated-motion-visibility-helpers';
import {
  getMotionForLeaveEntriesForCase,
  MotionForLeaveDocketEntries,
  MotionVisibilityPublicDocketEntry,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

const primaryFilings = (
  entries: MotionForLeaveDocketEntries,
): MotionVisibilityPublicDocketEntry[] => [
  entries.motionForLeave,
  ...entries.primarySupportingEntries,
];

const lodgedSecondaryFilings = (
  entries: MotionForLeaveDocketEntries,
): MotionVisibilityPublicDocketEntry[] => [
  entries.lodgedSecondary,
  ...entries.lodgedSecondarySupportingEntries,
];

describe('Consolidated group lodged motion visibility smoke', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Motion for Leave with lodged secondary on consolidated group', () => {
    let leadDocketNumber: string;
    let memberDocketNumber: string;
    let leadEntries: MotionForLeaveDocketEntries;
    let memberEntries: MotionForLeaveDocketEntries;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      createConsolidatedGroupWithOneMember().then(group => {
        ({ leadDocketNumber, memberDocketNumber } = group);
        prepareConsolidatedFiler('privatePractitioner', group);
        loginConsolidatedFiler('privatePractitioner');
        fileLeaveWithLodgedSecondaryOnGroup(leadDocketNumber, {
          filerTestId: getFilerTestIdForConsolidatedFiler(
            'privatePractitioner',
            group,
          ),
        });
        getMotionForLeaveEntriesForCase(leadDocketNumber).then(entries => {
          leadEntries = entries;
        });
        getMotionForLeaveEntriesForCase(memberDocketNumber).then(entries => {
          memberEntries = entries;
        });
      });
    });

    it('should let filer open Motion for Leave and lodged secondary on lead and member cases', () => {
      loginConsolidatedFiler('privatePractitioner');
      [
        { docketNumber: leadDocketNumber, entries: leadEntries },
        { docketNumber: memberDocketNumber, entries: memberEntries },
      ].forEach(({ docketNumber, entries }) => {
        cy.visit('/');
        goToCase(docketNumber);
        primaryFilings(entries).forEach(docketEntry => {
          verifyDocumentCanBeViewed(docketEntry.docketEntryId);
        });
        lodgedSecondaryFilings(entries).forEach(docketEntry => {
          verifyDocumentCanBeViewed(docketEntry.docketEntryId);
        });
      });
    });

    it('should let public download Motion for Leave on lead and member cases', () => {
      [
        { docketNumber: leadDocketNumber, entries: leadEntries },
        { docketNumber: memberDocketNumber, entries: memberEntries },
      ].forEach(({ docketNumber, entries }) => {
        primaryFilings(entries).forEach(docketEntry => {
          verifyDocumentCanBeViewedPublic(
            docketNumber,
            docketEntry.index,
            docketEntry.docketEntryId,
          );
        });
      });
    });

    it('should not let public download lodged secondary on lead and member cases', () => {
      [
        { docketNumber: leadDocketNumber, entries: leadEntries },
        { docketNumber: memberDocketNumber, entries: memberEntries },
      ].forEach(({ docketNumber, entries }) => {
        lodgedSecondaryFilings(entries).forEach(docketEntry => {
          verifyDocumentCannotBeViewedPublic(
            docketNumber,
            docketEntry.index,
            docketEntry.docketEntryId,
          );
        });
      });
    });

    it('should let terminal user download lodged secondary on lead and member cases', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        [
          { docketNumber: leadDocketNumber, entries: leadEntries },
          { docketNumber: memberDocketNumber, entries: memberEntries },
        ].forEach(({ docketNumber, entries }) => {
          lodgedSecondaryFilings(entries).forEach(docketEntry => {
            verifyDocumentCanBeViewedPublic(
              docketNumber,
              docketEntry.index,
              docketEntry.docketEntryId,
            );
          });
        });
      });
    });
  });
});
