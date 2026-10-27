import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../authentication/login-as-helpers';
import { addIntervenorAsPartyToCase } from '../caseDetail/caseInformation/add-intervenor-to-case';
import { addParticipantAsPartyToCase } from '../caseDetail/caseInformation/add-participant-to-case';
import { goToCase } from '../caseDetail/go-to-case';
import { attachFile } from '../file/upload-file';
import { selectTypeaheadInput } from '../components/typeAhead/select-typeahead-input';
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
  MotionVisibilityPublicDocketEntry,
} from './practitioner-filed-motion-visibility-helpers';

export type PaperFilingParty = 'petitioner' | 'respondent' | { other: string };

const selectPaperFilingParty = (party: PaperFilingParty): void => {
  if (party === 'petitioner') {
    cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
    return;
  }

  if (party === 'respondent') {
    cy.get('label[for="party-irs-practitioner"]').click();
    cy.get('#party-irs-practitioner').should('be.checked');
    return;
  }

  cy.get('label[for="has-other-filing-party"]').click();
  cy.get('#has-other-filing-party').should('be.checked');
  cy.get('#other-filing-party').type(party.other);
};

const createAndServePaperFilingForParty = ({
  dateReceived,
  documentType,
  party,
}: {
  dateReceived: string;
  documentType: string;
  party: PaperFilingParty;
}): void => {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-paper-filing"]').click();
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
  ).type(dateReceived);
  selectTypeaheadInput('primary-document-type-search', documentType);
  selectPaperFilingParty(party);
  cy.get('[data-testid="objections-No"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#primaryDocumentFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
};

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
    createAndServePaperFilingForParty({
      dateReceived: today,
      documentType: 'Motion for Continuance',
      party,
    });
    if (fileBriefAndMemorandum) {
      createAndServePaperFilingForParty({
        dateReceived: today,
        documentType: 'Brief in Support',
        party,
      });
      createAndServePaperFilingForParty({
        dateReceived: today,
        documentType: 'Memorandum in Support',
        party,
      });
    }
    return getPaperDocketEntriesForCase(docketNumber).then(paperEntries => {
      expect(paperEntries).to.have.length(expectedPaperEntryCount);
      return { docketNumber, paperEntries };
    });
  });
}
