import {
  calculateISODate,
  formatDateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../authentication/login-as-helpers';
import { addIntervenorAsPartyToCase } from '../caseDetail/caseInformation/add-intervenor-to-case';
import { addParticipantAsPartyToCase } from '../caseDetail/caseInformation/add-participant-to-case';
import { goToCase } from '../caseDetail/go-to-case';
import { createAndServePaperFiling } from '../caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import type { PaperFilingParty } from '../caseDetail/docketRecord/paperFiling/fill-paper-filing-form';
import { externalUserCreatesElectronicCase } from '../fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../documentQC/petitionsclerk-serves-petition';
import {
  getDocketEntriesByEventCodeForCase,
  getDocketEntryByEventCodeForCase,
  getPaperDocketEntriesForCase,
} from './motion-visibility-docket-entry-helpers';
import {
  fileIrsAnswer,
  fileMotionAndSupports,
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  MotionVisibilityPublicDocketEntry,
} from './practitioner-filed-motion-visibility-helpers';

export type PetitionerFiledMotionCaseFixture = {
  docketNumber: string;
  motion: MotionVisibilityPublicDocketEntry;
  supportingEntries: MotionVisibilityPublicDocketEntry[];
};

export type PaperFiledMotionCaseFixture = {
  docketNumber: string;
  paperEntries: MotionVisibilityPublicDocketEntry[];
};

export type CreatePetitionerFiledMotionOptions = {
  addParty?: {
    name: string;
    type: 'intervenor' | 'participant';
  };
  documentType?: string;
  filingPartyTestId: string;
  motionEventCode?: string;
  primaryFilerName: string;
  supportingDocs?: string[];
};

export function setMotionVisibilityPolicyDateToToday(): void {
  const today = formatDateString(calculateISODate({}), 'yyyy-MM-dd');

  cy.task('toggleFeatureFlag', {
    flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    flagValue: today,
  });
}

const getPetitionerFiledMotionCaseFixture = (
  docketNumber: string,
  motionEventCode: string,
  supportingDocs?: string[],
): Cypress.Chainable<PetitionerFiledMotionCaseFixture> =>
  getDocketEntryByEventCodeForCase(docketNumber, motionEventCode, false).then(
    motion =>
      getDocketEntriesByEventCodeForCase(docketNumber, 'BRF', false).then(
        briefEntries =>
          getDocketEntriesByEventCodeForCase(docketNumber, 'MISP', false).then(
            memorandumEntries => {
              if (!supportingDocs?.length) {
                return {
                  docketNumber,
                  motion,
                  supportingEntries: [],
                };
              }

              const briefCount = supportingDocs.filter(
                doc => doc === 'Brief in Support',
              ).length;
              const memorandumCount = supportingDocs.filter(
                doc => doc === 'Memorandum in Support',
              ).length;

              expect(briefEntries).to.have.length(briefCount);
              expect(memorandumEntries).to.have.length(memorandumCount);

              return {
                docketNumber,
                motion,
                supportingEntries: [...briefEntries, ...memorandumEntries],
              };
            },
          ),
      ),
  );

export function createPetitionerFiledMotionCase({
  addParty,
  documentType,
  filingPartyTestId,
  motionEventCode = MOTION_FOR_CONTINUANCE_EVENT_CODE,
  primaryFilerName,
  supportingDocs,
}: CreatePetitionerFiledMotionOptions): Cypress.Chainable<PetitionerFiledMotionCaseFixture> {
  loginAsPetitioner();
  return externalUserCreatesElectronicCase(primaryFilerName)
    .then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      if (addParty) {
        loginAsDocketClerk1();
        goToCase(docketNumber);
        if (addParty.type === 'intervenor') {
          addIntervenorAsPartyToCase(addParty.name);
        } else {
          addParticipantAsPartyToCase(addParty.name);
        }
      }

      loginAsPetitioner();
      fileMotionAndSupports(docketNumber, {
        documentType,
        filingPartyTestId,
        supportingDocs,
      });

      return docketNumber;
    })
    .then(docketNumber =>
      getPetitionerFiledMotionCaseFixture(
        docketNumber,
        motionEventCode,
        supportingDocs,
      ),
    );
}

export function createCaseWithPaperFiledMotionDocuments({
  loginAsClerk,
  party,
  fileBriefAndMemorandum = false,
  expectedPaperEntryCount,
}: {
  loginAsClerk: () => void;
  party: PaperFilingParty;
  fileBriefAndMemorandum?: boolean;
  expectedPaperEntryCount: number;
}): Cypress.Chainable<PaperFiledMotionCaseFixture> {
  const today = formatNow(FORMATS.MMDDYYYY);

  loginAsPetitioner();
  return externalUserCreatesElectronicCase().then(docketNumber => {
    petitionsClerkServesPetition(docketNumber);
    fileIrsAnswer(docketNumber);
    loginAsClerk();
    goToCase(docketNumber);
    createAndServePaperFiling({
      dateReceived: today,
      documentType: 'Motion for Continuance',
      isPaperCase: false,
      party,
    });
    if (fileBriefAndMemorandum) {
      createAndServePaperFiling({
        dateReceived: today,
        documentType: 'Brief in Support',
        isPaperCase: false,
        party,
      });
      createAndServePaperFiling({
        dateReceived: today,
        documentType: 'Memorandum in Support',
        isPaperCase: false,
        party,
      });
    }
    return getPaperDocketEntriesForCase(docketNumber).then(paperEntries => {
      expect(paperEntries).to.have.length(expectedPaperEntryCount);
      return { docketNumber, paperEntries };
    });
  });
}
