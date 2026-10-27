import {
  loginAsIrsPractitioner,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  ConsolidatedGroupFixture,
  ConsolidatedMotionFiler,
  createConsolidatedGroupWithOneMember,
  fileLeaveWithLodgedSecondaryOnGroup,
  getFilingPartyTestIdForConsolidatedFiler,
  loginConsolidatedFiler,
  prepareConsolidatedFiler,
} from '../../../../helpers/documentVisibility/consolidated-motion-visibility-helpers';
import {
  getMotionForLeaveEntriesForCase,
  MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
  MotionForLeaveDocketEntries,
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  MotionVisibilityPublicDocketEntry,
  PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
  UNAUTHORIZED_PETITIONER_EMAIL,
  restoreMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

const unassociatedExternalRoles = [
  {
    login: () => loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL),
    role: 'petitioner not on case',
  },
  {
    login: () => loginAsPrivatePractitioner('privatePractitioner2@example.com'),
    role: 'private practitioner not on case',
  },
  {
    login: () => loginAsIrsPractitioner(),
    role: 'IRS practitioner not on case',
  },
];

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

describe('Consolidated group lodged motion visibility', () => {
  beforeEach(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  [
    {
      title:
        'Motion visibility for Motion for Leave with lodged secondary on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
    },
    {
      title:
        'Motion visibility for Leave Out of Time with lodged secondary on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      primaryDocumentType: 'Motion for Leave to File Out of Time',
    },
    {
      title:
        'Motion visibility for lodged secondary Motion for a New Trial on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      secondaryDocumentType: MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
    },
    {
      title:
        'Motion visibility for IRS filer Motion for Leave on consolidated group',
      filer: 'irsPractitioner' as ConsolidatedMotionFiler,
    },
    {
      title:
        'Motion visibility for DOJ filer Motion for Leave on consolidated group',
      filer: 'dojPractitioner' as ConsolidatedMotionFiler,
    },
    {
      title:
        'Motion visibility for Motion for Leave with five supporting documents on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      primarySupportingDocs: PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
      secondarySupportingDocs: PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
    },
  ].forEach(
    ({
      title,
      filer,
      primaryDocumentType,
      primarySupportingDocs,
      secondaryDocumentType,
      secondarySupportingDocs,
    }) => {
      describe(title, () => {
        let group: ConsolidatedGroupFixture;
        let leadDocketNumber: string;
        let memberDocketNumber: string;
        let leadEntries: MotionForLeaveDocketEntries;
        let memberEntries: MotionForLeaveDocketEntries;

        afterEach(() => {
          cy.task('setAllowedTerminalIpAddresses', []);
        });

        before(() => {
          createConsolidatedGroupWithOneMember().then(createdGroup => {
            group = createdGroup;
            ({ leadDocketNumber, memberDocketNumber } = createdGroup);
            prepareConsolidatedFiler(filer, group);
            loginConsolidatedFiler(filer);
            fileLeaveWithLodgedSecondaryOnGroup(leadDocketNumber, {
              filingPartyTestId: getFilingPartyTestIdForConsolidatedFiler(
                filer,
                group,
              ),
              primaryDocumentType,
              primarySupportingDocs,
              secondaryDocumentType,
              secondarySupportingDocs,
            });
            getMotionForLeaveEntriesForCase(leadDocketNumber).then(entries => {
              leadEntries = entries;
            });
            getMotionForLeaveEntriesForCase(memberDocketNumber).then(
              entries => {
                memberEntries = entries;
              },
            );
          });
        });

        it('should let filer open Motion for Leave and lodged secondary on lead and member cases', () => {
          loginConsolidatedFiler(filer);
          [
            { docketNumber: leadDocketNumber, entries: leadEntries },
            { docketNumber: memberDocketNumber, entries: memberEntries },
          ].forEach(({ docketNumber, entries }) => {
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
              verifyDocumentCanBeViewedPublic(docketNumber, docketEntry.index);
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
              );
            });
          });
        });

        unassociatedExternalRoles.forEach(({ login, role }) => {
          it(`should let ${role} download Motion for Leave on lead and member cases`, () => {
            login();
            [
              { docketNumber: leadDocketNumber, entries: leadEntries },
              { docketNumber: memberDocketNumber, entries: memberEntries },
            ].forEach(({ docketNumber, entries }) => {
              goToCase(docketNumber);
              primaryFilings(entries).forEach(docketEntry => {
                verifyDocumentCanBeViewed(docketEntry.docketEntryId);
              });
            });
          });

          it(`should not let ${role} download lodged secondary on lead and member cases`, () => {
            login();
            [
              { docketNumber: leadDocketNumber, entries: leadEntries },
              { docketNumber: memberDocketNumber, entries: memberEntries },
            ].forEach(({ docketNumber, entries }) => {
              goToCase(docketNumber);
              lodgedSecondaryFilings(entries).forEach(docketEntry => {
                verifyDocumentCannotBeViewed(
                  docketNumber,
                  docketEntry.docketEntryId,
                );
              });
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
                );
              });
            });
          });
        });
      });
    },
  );
});
