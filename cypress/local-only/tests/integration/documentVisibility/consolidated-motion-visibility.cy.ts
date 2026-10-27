import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  ConsolidatedMotionFiler,
  createConsolidatedGroupWithOneMember,
  fileConsolidatedMotionOnGroup,
  fileSupportInSupportOfMotionOnGroup,
  getEFiledMotionOnCase,
  getFilingPartyTestIdForConsolidatedFiler,
  getMotionAndSupportingEntriesForCase,
  getMotionEventCodeForDocumentType,
  getMotionVisibilityDocketEntriesForCase,
  loginConsolidatedFiler,
  prepareConsolidatedFiler,
} from '../../../../helpers/documentVisibility/consolidated-motion-visibility-helpers';
import {
  unassociatedExternalRolesForIrsPractitionerFiledMotion,
  unassociatedExternalRolesForPrivatePractitionerFiledMotion,
  MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  MotionVisibilityDocketEntries,
  MotionVisibilityPublicDocketEntry,
  PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
  restoreMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToToday,
  setMotionVisibilityPolicyDateToTomorrow,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Consolidated group motion visibility', () => {
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
        'Motion visibility for private practitioner motion on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for IRS practitioner motion on consolidated group',
      filer: 'irsPractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for DOJ practitioner motion on consolidated group',
      filer: 'dojPractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for Motion for a New Trial on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      documentType: MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
    },
  ].forEach(({ title, filer, documentType }) => {
    describe(title, () => {
      let leadDocketNumber: string;
      let memberDocketNumber: string;
      let leadMotionEntry: MotionVisibilityPublicDocketEntry;
      let memberMotionEntry: MotionVisibilityPublicDocketEntry;
      const motionEventCode = getMotionEventCodeForDocumentType(documentType);

      before(() => {
        createConsolidatedGroupWithOneMember().then(group => {
          ({ leadDocketNumber, memberDocketNumber } = group);
          prepareConsolidatedFiler(filer, group);
          fileConsolidatedMotionOnGroup(leadDocketNumber, filer, group, {
            documentType,
            supportingDocs: [],
          });
          getEFiledMotionOnCase(leadDocketNumber, motionEventCode).then(
            motionEntry => {
              leadMotionEntry = motionEntry;
            },
          );
          getEFiledMotionOnCase(memberDocketNumber, motionEventCode).then(
            motionEntry => {
              memberMotionEntry = motionEntry;
            },
          );
        });
      });

      it('should let filer open motion on lead and member cases', () => {
        loginConsolidatedFiler(filer);
        goToCase(leadDocketNumber);
        verifyDocumentCanBeViewed(leadMotionEntry.docketEntryId);
        goToCase(memberDocketNumber);
        verifyDocumentCanBeViewed(memberMotionEntry.docketEntryId);
      });

      it('should let public download motion on lead and member cases', () => {
        verifyMotionViewableOnPublicSite(leadDocketNumber, leadMotionEntry);
        verifyMotionViewableOnPublicSite(memberDocketNumber, memberMotionEntry);
      });
    });
  });

  [
    {
      title:
        'Motion visibility for private practitioner motion with supporting documents on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for IRS practitioner motion with supporting documents on consolidated group',
      filer: 'irsPractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for DOJ practitioner motion with supporting documents on consolidated group',
      filer: 'dojPractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
    },
    {
      title:
        'Motion visibility for Motion for a New Trial with supporting documents on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      documentType: MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
    },
    {
      title:
        'Motion visibility for motion with five supporting documents on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      documentType: 'Motion for Continuance',
      supportingDocs: PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
    },
  ].forEach(({ title, filer, documentType, supportingDocs }) => {
    describe(title, () => {
      let leadDocketNumber: string;
      let memberDocketNumber: string;
      let leadMotionEntries: MotionVisibilityDocketEntries;
      let memberMotionEntries: MotionVisibilityDocketEntries;
      let leadMotionEntry: MotionVisibilityPublicDocketEntry;
      let memberMotionEntry: MotionVisibilityPublicDocketEntry;
      let leadSupportingEntries: MotionVisibilityPublicDocketEntry[] = [];
      let memberSupportingEntries: MotionVisibilityPublicDocketEntry[] = [];
      const motionEventCode = getMotionEventCodeForDocumentType(documentType);
      const supportingDocumentCount = supportingDocs?.length ?? 2;

      before(() => {
        createConsolidatedGroupWithOneMember().then(group => {
          ({ leadDocketNumber, memberDocketNumber } = group);
          prepareConsolidatedFiler(filer, group);
          fileConsolidatedMotionOnGroup(leadDocketNumber, filer, group, {
            documentType,
            supportingDocs,
          });

          if (supportingDocumentCount === 5) {
            getMotionAndSupportingEntriesForCase(
              leadDocketNumber,
              motionEventCode,
            ).then(({ motion, supportingEntries }) => {
              leadMotionEntry = motion;
              leadSupportingEntries = supportingEntries;
            });
            getMotionAndSupportingEntriesForCase(
              memberDocketNumber,
              motionEventCode,
            ).then(({ motion, supportingEntries }) => {
              memberMotionEntry = motion;
              memberSupportingEntries = supportingEntries;
            });
            return;
          }

          getMotionVisibilityDocketEntriesForCase(
            leadDocketNumber,
            motionEventCode,
          ).then(motionEntries => {
            leadMotionEntries = motionEntries;
          });
          getMotionVisibilityDocketEntriesForCase(
            memberDocketNumber,
            motionEventCode,
          ).then(motionEntries => {
            memberMotionEntries = motionEntries;
          });
        });
      });

      it('should let filer open motion and supporting documents on lead and member cases', () => {
        loginConsolidatedFiler(filer);

        if (supportingDocumentCount === 5) {
          [
            {
              docketNumber: leadDocketNumber,
              motionEntry: leadMotionEntry,
              supportingEntries: leadSupportingEntries,
            },
            {
              docketNumber: memberDocketNumber,
              motionEntry: memberMotionEntry,
              supportingEntries: memberSupportingEntries,
            },
          ].forEach(({ docketNumber, motionEntry, supportingEntries }) => {
            goToCase(docketNumber);
            verifyDocumentCanBeViewed(motionEntry.docketEntryId);
            supportingEntries.forEach(supportingEntry => {
              verifyDocumentCanBeViewed(supportingEntry.docketEntryId);
            });
          });
          return;
        }

        [
          { docketNumber: leadDocketNumber, motionEntries: leadMotionEntries },
          {
            docketNumber: memberDocketNumber,
            motionEntries: memberMotionEntries,
          },
        ].forEach(({ docketNumber, motionEntries }) => {
          goToCase(docketNumber);
          verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
          verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
          verifyDocumentCanBeViewed(
            motionEntries.memorandaInSupport.docketEntryId,
          );
        });
      });

      it('should let public download motion and supporting documents on lead and member cases', () => {
        if (supportingDocumentCount === 5) {
          [
            {
              docketNumber: leadDocketNumber,
              motionEntry: leadMotionEntry,
              supportingEntries: leadSupportingEntries,
            },
            {
              docketNumber: memberDocketNumber,
              motionEntry: memberMotionEntry,
              supportingEntries: memberSupportingEntries,
            },
          ].forEach(({ docketNumber, motionEntry, supportingEntries }) => {
            verifyDocumentCanBeViewedPublic(docketNumber, motionEntry.index);
            supportingEntries.forEach(supportingEntry => {
              verifyDocumentCanBeViewedPublic(
                docketNumber,
                supportingEntry.index,
              );
            });
          });
          return;
        }

        [
          { docketNumber: leadDocketNumber, motionEntries: leadMotionEntries },
          {
            docketNumber: memberDocketNumber,
            motionEntries: memberMotionEntries,
          },
        ].forEach(({ docketNumber, motionEntries }) => {
          verifyDocumentCanBeViewedPublic(
            docketNumber,
            motionEntries.motion.index,
          );
          verifyDocumentCanBeViewedPublic(
            docketNumber,
            motionEntries.briefInSupport.index,
          );
          verifyDocumentCanBeViewedPublic(
            docketNumber,
            motionEntries.memorandaInSupport.index,
          );
        });
      });

      (filer === 'irsPractitioner'
        ? unassociatedExternalRolesForIrsPractitionerFiledMotion
        : unassociatedExternalRolesForPrivatePractitionerFiledMotion
      ).forEach(({ login, role }) => {
        it(`should let ${role} open motion and supporting documents on lead and member cases`, () => {
          login();

          if (supportingDocumentCount === 5) {
            [
              {
                docketNumber: leadDocketNumber,
                motionEntry: leadMotionEntry,
                supportingEntries: leadSupportingEntries,
              },
              {
                docketNumber: memberDocketNumber,
                motionEntry: memberMotionEntry,
                supportingEntries: memberSupportingEntries,
              },
            ].forEach(({ docketNumber, motionEntry, supportingEntries }) => {
              goToCase(docketNumber);
              verifyDocumentCanBeViewed(motionEntry.docketEntryId);
              supportingEntries.forEach(supportingEntry => {
                verifyDocumentCanBeViewed(supportingEntry.docketEntryId);
              });
            });
            return;
          }

          [
            {
              docketNumber: leadDocketNumber,
              motionEntries: leadMotionEntries,
            },
            {
              docketNumber: memberDocketNumber,
              motionEntries: memberMotionEntries,
            },
          ].forEach(({ docketNumber, motionEntries }) => {
            goToCase(docketNumber);
            verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
            verifyDocumentCanBeViewed(
              motionEntries.briefInSupport.docketEntryId,
            );
            verifyDocumentCanBeViewed(
              motionEntries.memorandaInSupport.docketEntryId,
            );
          });
        });
      });
    });
  });

  [
    {
      title:
        'Motion visibility for brief in support of an existing motion on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      supportingDocumentType: 'Brief in Support' as const,
      setPolicyDateToTomorrowBeforeMotion: true,
    },
    {
      title:
        'Motion visibility for IRS filer brief in support of an existing motion on consolidated group',
      filer: 'irsPractitioner' as ConsolidatedMotionFiler,
      supportingDocumentType: 'Brief in Support' as const,
      setPolicyDateToTomorrowBeforeMotion: true,
    },
    {
      title:
        'Motion visibility for DOJ filer brief in support of an existing motion on consolidated group',
      filer: 'dojPractitioner' as ConsolidatedMotionFiler,
      supportingDocumentType: 'Brief in Support' as const,
      setPolicyDateToTomorrowBeforeMotion: true,
    },
    {
      title:
        'Motion visibility for memorandum in support of an existing motion on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      supportingDocumentType: 'Memorandum in Support' as const,
      setPolicyDateToTomorrowBeforeMotion: true,
    },
    {
      title:
        'Motion visibility for brief in support when motion was filed after policy change date on consolidated group',
      filer: 'privatePractitioner' as ConsolidatedMotionFiler,
      supportingDocumentType: 'Brief in Support' as const,
      setPolicyDateToTomorrowBeforeMotion: false,
    },
  ].forEach(
    ({
      title,
      filer,
      supportingDocumentType,
      setPolicyDateToTomorrowBeforeMotion,
    }) => {
      describe(title, () => {
        let leadDocketNumber: string;
        let memberDocketNumber: string;
        let leadMotionEntry: MotionVisibilityPublicDocketEntry;
        let memberMotionEntry: MotionVisibilityPublicDocketEntry;
        let leadSupportingEntry: MotionVisibilityPublicDocketEntry;
        let memberSupportingEntry: MotionVisibilityPublicDocketEntry;
        const supportingDocumentLabel =
          supportingDocumentType === 'Brief in Support'
            ? 'brief in support'
            : 'memorandum in support';
        afterEach(() => {
          cy.task('setAllowedTerminalIpAddresses', []);
        });

        before(() => {
          createConsolidatedGroupWithOneMember().then(group => {
            ({ leadDocketNumber, memberDocketNumber } = group);
            prepareConsolidatedFiler(filer, group);

            if (setPolicyDateToTomorrowBeforeMotion) {
              setMotionVisibilityPolicyDateToTomorrow();
            }

            fileConsolidatedMotionOnGroup(leadDocketNumber, filer, group, {
              supportingDocs: [],
            });

            setMotionVisibilityPolicyDateToToday();

            loginConsolidatedFiler(filer);
            fileSupportInSupportOfMotionOnGroup(leadDocketNumber, {
              documentType: supportingDocumentType,
              filingPartyTestId: getFilingPartyTestIdForConsolidatedFiler(
                filer,
                group,
              ),
            });

            getEFiledMotionOnCase(leadDocketNumber).then(motionEntry => {
              leadMotionEntry = motionEntry;
            });
            getEFiledMotionOnCase(memberDocketNumber).then(motionEntry => {
              memberMotionEntry = motionEntry;
            });

            const supportingEventCode =
              supportingDocumentType === 'Brief in Support' ? 'BRF' : 'MISP';

            getMotionAndSupportingEntriesForCase(leadDocketNumber).then(
              ({ supportingEntries }) => {
                const supportingEntry = supportingEntries.find(
                  entry => entry.eventCode === supportingEventCode,
                );
                if (!supportingEntry) {
                  throw new Error(
                    `${supportingDocumentType} docket entry was not found on lead case`,
                  );
                }
                leadSupportingEntry = supportingEntry;
              },
            );
            getMotionAndSupportingEntriesForCase(memberDocketNumber).then(
              ({ supportingEntries }) => {
                const supportingEntry = supportingEntries.find(
                  entry => entry.eventCode === supportingEventCode,
                );
                if (!supportingEntry) {
                  throw new Error(
                    `${supportingDocumentType} docket entry was not found on member case`,
                  );
                }
                memberSupportingEntry = supportingEntry;
              },
            );
          });
        });

        it(`should let filer open later ${supportingDocumentLabel} on lead and member cases`, () => {
          loginConsolidatedFiler(filer);
          goToCase(leadDocketNumber);
          verifyDocumentCanBeViewed(leadSupportingEntry.docketEntryId);
          goToCase(memberDocketNumber);
          verifyDocumentCanBeViewed(memberSupportingEntry.docketEntryId);
        });

        it('should let public download original motion on lead and member cases', () => {
          verifyMotionViewableOnPublicSite(leadDocketNumber, leadMotionEntry);
          verifyMotionViewableOnPublicSite(
            memberDocketNumber,
            memberMotionEntry,
          );
        });

        it(`should not let public download later ${supportingDocumentLabel} on lead and member cases`, () => {
          verifyDocumentCannotBeViewedPublic(
            leadDocketNumber,
            leadSupportingEntry.index,
          );
          verifyDocumentCannotBeViewedPublic(
            memberDocketNumber,
            memberSupportingEntry.index,
          );
        });

        (filer === 'irsPractitioner'
          ? unassociatedExternalRolesForIrsPractitionerFiledMotion
          : unassociatedExternalRolesForPrivatePractitionerFiledMotion
        ).forEach(({ login, role }) => {
          it(`should not let ${role} download later ${supportingDocumentLabel} on lead and member cases`, () => {
            login();
            goToCase(leadDocketNumber);
            verifyDocumentCannotBeViewed(
              leadDocketNumber,
              leadSupportingEntry.docketEntryId,
            );
            goToCase(memberDocketNumber);
            verifyDocumentCannotBeViewed(
              memberDocketNumber,
              memberSupportingEntry.docketEntryId,
            );
          });
        });

        it(`should let terminal user download later ${supportingDocumentLabel} on lead and member cases`, () => {
          cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
            verifyDocumentCanBeViewedPublic(
              leadDocketNumber,
              leadSupportingEntry.index,
            );
            verifyDocumentCanBeViewedPublic(
              memberDocketNumber,
              memberSupportingEntry.index,
            );
          });
        });
      });
    },
  );
});
