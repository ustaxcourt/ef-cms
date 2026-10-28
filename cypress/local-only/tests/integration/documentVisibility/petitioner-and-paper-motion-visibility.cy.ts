import {
  loginAsCaseServicesSupervisor,
  loginAsClerkOfCourt,
  loginAsDocketClerk1,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createCaseWithPaperFiledMotionDocuments,
  createCaseWithPetitionerFiledMotion,
  OTHER_FILING_PARTY_NAME,
  type PaperFilingParty,
} from 'cypress/helpers/documentVisibility/petitioner-paper-motion-visibility-helpers';
import {
  unassociatedExternalRolesForPetitionerOrPaperMotionCase,
  MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
  MOTION_FOR_NEW_TRIAL_EVENT_CODE,
  MotionVisibilityPublicDocketEntry,
  PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToToday,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionNotViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Petitioner-filed and paper-filed motion visibility', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  [
    {
      title:
        'Motion visibility for petitioner-filed motion on behalf of an intervenor',
      supportingDocumentCount: 0,
      motionSetup: {
        additionalContact: {
          type: 'intervenor' as const,
        },
      },
    },
    {
      title:
        'Motion visibility for petitioner-filed motion on behalf of a participant',
      supportingDocumentCount: 0,
      motionSetup: {
        additionalContact: {
          type: 'participant' as const,
        },
      },
    },
    {
      title: 'Motion visibility for petitioner-filed Motion for a New Trial',
      supportingDocumentCount: 0,
      motionSetup: {
        documentType: MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE,
        motionEventCode: MOTION_FOR_NEW_TRIAL_EVENT_CODE,
      },
    },
    {
      title:
        'Motion visibility for petitioner-filed motion with five supporting documents',
      supportingDocumentCount: 5,
      motionSetup: {
        supportingDocs: PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES,
      },
    },
  ].forEach(({ title, motionSetup, supportingDocumentCount }) => {
    describe(title, () => {
      let caseDocketNumber: string;
      let motionEntry: MotionVisibilityPublicDocketEntry;
      let supportingEntries: MotionVisibilityPublicDocketEntry[] = [];

      beforeEach(() => {
        setMotionVisibilityPolicyDateToToday();
      });

      before(() => {
        createCaseWithPetitionerFiledMotion(motionSetup).then(
          ({ docketNumber, motion, supportingEntries: docs }) => {
            caseDocketNumber = docketNumber;
            motionEntry = motion;
            supportingEntries = docs;
          },
        );
      });

      it('should let filer open petitioner-filed motion', () => {
        loginAsPetitioner();
        goToCase(caseDocketNumber);
        verifyDocumentCanBeViewed(motionEntry.docketEntryId);
      });

      Array.from({ length: supportingDocumentCount }).forEach(
        (_, supportingIndex) => {
          const supportingNumber = supportingIndex + 1;

          it(`should let filer open supporting document ${supportingNumber}`, () => {
            loginAsPetitioner();
            goToCase(caseDocketNumber);
            verifyDocumentCanBeViewed(
              supportingEntries[supportingIndex].docketEntryId,
            );
          });

          it(`should not let supporting document ${supportingNumber} be downloadable from public site`, () => {
            verifyDocumentCannotBeViewedPublic(
              caseDocketNumber,
              supportingEntries[supportingIndex].index,
            );
          });
        },
      );

      it('should not let motion be downloadable from public site', () => {
        verifyMotionNotViewableOnPublicSite(caseDocketNumber, motionEntry);
      });

      unassociatedExternalRolesForPetitionerOrPaperMotionCase.forEach(
        ({ login, role }) => {
          it(`should not let motion be downloadable by ${role}`, () => {
            login();
            goToCase(caseDocketNumber);
            verifyDocumentCannotBeViewed(
              caseDocketNumber,
              motionEntry.docketEntryId,
            );
          });
        },
      );
    });
  });

  [
    {
      title:
        'Paper-filed motion for respondent party filed by case services supervisor',
      loginAsClerk: () => loginAsCaseServicesSupervisor(),
      expectedPaperEntryCount: 1,
      party: 'respondent' as PaperFilingParty,
    },
    {
      title:
        'Paper-filed motion for respondent party filed by clerk of the court',
      loginAsClerk: () => loginAsClerkOfCourt(),
      expectedPaperEntryCount: 1,
      party: 'respondent' as PaperFilingParty,
    },
    {
      title: 'Paper-filed motion for petitioner party',
      loginAsClerk: () => loginAsDocketClerk1(),
      expectedPaperEntryCount: 1,
      party: 'petitioner' as PaperFilingParty,
    },
    {
      title: 'Paper-filed motion for other filing party',
      loginAsClerk: () => loginAsDocketClerk1(),
      expectedPaperEntryCount: 1,
      party: { other: OTHER_FILING_PARTY_NAME } as PaperFilingParty,
    },
    {
      title: 'Paper-filed motion with separate brief and memorandum in support',
      loginAsClerk: () => loginAsDocketClerk1(),
      expectedPaperEntryCount: 3,
      party: 'respondent' as PaperFilingParty,
      fileBriefAndMemorandum: true,
    },
  ].forEach(
    ({
      title,
      loginAsClerk,
      expectedPaperEntryCount,
      party,
      fileBriefAndMemorandum,
    }) => {
      describe(title, () => {
        let caseDocketNumber: string;
        let paperEntries: MotionVisibilityPublicDocketEntry[];

        beforeEach(() => {
          setMotionVisibilityPolicyDateToToday();
        });

        afterEach(() => {
          cy.task('setAllowedTerminalIpAddresses', []);
        });

        before(() => {
          createCaseWithPaperFiledMotionDocuments({
            loginAsClerk,
            party,
            fileBriefAndMemorandum,
            expectedPaperEntryCount,
          }).then(({ docketNumber, paperEntries: entries }) => {
            caseDocketNumber = docketNumber;
            paperEntries = entries;
          });
        });

        Array.from({ length: expectedPaperEntryCount }).forEach(
          (_, entryIndex) => {
            const entryNumber = entryIndex + 1;

            it(`should not let paper docket entry ${entryNumber} be downloadable from public site`, () => {
              verifyDocumentCannotBeViewedPublic(
                caseDocketNumber,
                paperEntries[entryIndex].index,
              );
            });

            unassociatedExternalRolesForPetitionerOrPaperMotionCase.forEach(
              ({ login, role }) => {
                it(`should not let paper docket entry ${entryNumber} be downloadable by ${role}`, () => {
                  login();
                  goToCase(caseDocketNumber);
                  verifyDocumentCannotBeViewed(
                    caseDocketNumber,
                    paperEntries[entryIndex].docketEntryId,
                  );
                });
              },
            );

            it(`should let terminal user open paper docket entry ${entryNumber}`, () => {
              cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(
                () => {
                  verifyDocumentCanBeViewedPublic(
                    caseDocketNumber,
                    paperEntries[entryIndex].index,
                  );
                },
              );
            });
          },
        );
      });
    },
  );
});
