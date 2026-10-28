import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { faker } from '@faker-js/faker';
import {
  loginAsDocketClerk1,
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsPrivatePractitioner,
} from '../authentication/login-as-helpers';
import { addCaseToGroup } from '../caseDetail/add-case-to-group';
import { updateCaseStatus } from '../caseDetail/caseInformation/update-case-status';
import { petitionsClerkAddsRespondentToCase } from '../caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { goToCase } from '../caseDetail/go-to-case';
import { externalUserSearchesDocketNumber } from '../advancedSearch/external-user-searches-docket-number';
import { selectTypeaheadInput } from '../components/typeAhead/select-typeahead-input';
import { createAndServePaperPetition } from '../fileAPetition/create-and-serve-paper-petition';
import {
  getEFiledMotionOnCase,
  getMotionAndSupportingEntriesForCase,
  getMotionVisibilityDocketEntriesForCase,
} from './motion-visibility-docket-entry-helpers';
import {
  fileIrsAnswer,
  fileLeaveWithLodgedSecondaryOnGroup,
  fileMotionOnGroup,
  fileSupportInSupportOfMotionOnGroup,
} from './file-motion-visibility';
import {
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MOTION_FOR_NEW_TRIAL_EVENT_CODE,
} from './motion-visibility-constants';
export {
  fileLeaveWithLodgedSecondaryOnGroup,
  fileSupportInSupportOfMotionOnGroup,
  getEFiledMotionOnCase,
  getMotionAndSupportingEntriesForCase,
  getMotionVisibilityDocketEntriesForCase,
};
export type {
  FileLeaveWithLodgedSecondaryOnGroupOptions,
  FileSupportInSupportOfMotionOnGroupOptions,
} from './file-motion-visibility';

const DOJ_RESPONDENT_BAR_NUMBER = 'WN7777';

export type ConsolidatedGroupFixture = {
  leadDocketNumber: string;
  leadPetitionerName: string;
  memberDocketNumber: string;
  memberPetitionerName: string;
};

export type ConsolidatedMotionFiler =
  'dojPractitioner' | 'irsPractitioner' | 'privatePractitioner';

export function createConsolidatedGroupWithOneMember(): Cypress.Chainable<ConsolidatedGroupFixture> {
  const leadPetitionerName = faker.person.firstName();
  const memberPetitionerName = faker.person.firstName();

  return createAndServePaperPetition({ name: leadPetitionerName }).then(
    ({ docketNumber: leadDocketNumber }) => {
      loginAsDocketClerk1();
      goToCase(leadDocketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

      return createAndServePaperPetition({ name: memberPetitionerName }).then(
        ({ docketNumber: memberDocketNumber }) => {
          loginAsDocketClerk1();
          goToCase(memberDocketNumber);
          updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
          addCaseToGroup(leadDocketNumber);

          return {
            leadDocketNumber,
            leadPetitionerName,
            memberDocketNumber,
            memberPetitionerName,
          };
        },
      );
    },
  );
}

export function associatePrivatePractitionerOnCase(
  docketNumber: string,
  petitionerName: string,
): void {
  loginAsPrivatePractitioner();
  externalUserSearchesDocketNumber(docketNumber);
  cy.get('[data-testid="request-represent-a-party-button"]').click();
  selectTypeaheadInput(
    'case-association-document-type-search',
    'Entry of Appearance',
  );
  cy.get(`[data-testid="filer-${petitionerName}, Petitioner"]`).click();
  cy.get('[data-testid="auto-generation"]').should('exist');
  cy.get('[data-testid="request-access-submit-document"]').click();
  cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
  cy.get('[data-testid="submit-represent-a-party-button"]').click();
  cy.get('[data-testid="document-download-link-EA"]').should('exist');
}

export function preparePrivatePractitionerConsolidatedFiler(
  group: ConsolidatedGroupFixture,
): void {
  associatePrivatePractitionerOnCase(
    group.leadDocketNumber,
    group.leadPetitionerName,
  );
  associatePrivatePractitionerOnCase(
    group.memberDocketNumber,
    group.memberPetitionerName,
  );
}

export function prepareIrsConsolidatedFiler(docketNumbers: string[]): void {
  docketNumbers.forEach(docketNumber => {
    fileIrsAnswer(docketNumber);
  });
}

export function prepareDojConsolidatedFiler(docketNumbers: string[]): void {
  docketNumbers.forEach(docketNumber => {
    petitionsClerkAddsRespondentToCase(docketNumber, DOJ_RESPONDENT_BAR_NUMBER);
    loginAsDocketClerk1();
    goToCase(docketNumber);
    updateCaseStatus(CASE_STATUS_TYPES.onAppeal);
    loginAsDojPractitioner();
    externalUserSearchesDocketNumber(docketNumber);
    cy.get('[data-testid="request-represent-a-party-button"]').click();
    selectTypeaheadInput(
      'case-association-document-type-search',
      'Entry of Appearance',
    );
    cy.get('[data-testid="auto-generation"]').should('exist');
    cy.get('[data-testid="request-access-submit-document"]').click();
    cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
    cy.get('[data-testid="submit-represent-a-party-button"]').click();
    cy.get('[data-testid="document-download-link-EA"]').should('exist');
  });
}

export function getPrivatePractitionerFilerTestId(
  group: ConsolidatedGroupFixture,
): string {
  return `filingParty-${group.leadPetitionerName}, Petitioner`;
}

export function getRespondentFilerTestId(): string {
  return 'party-irs-practitioner-label';
}

export function loginConsolidatedFiler(filer: ConsolidatedMotionFiler): void {
  if (filer === 'privatePractitioner') {
    loginAsPrivatePractitioner();
    return;
  }

  if (filer === 'irsPractitioner') {
    loginAsIrsPractitioner();
    return;
  }

  loginAsDojPractitioner();
}

export function prepareConsolidatedFiler(
  filer: ConsolidatedMotionFiler,
  group: ConsolidatedGroupFixture,
): void {
  const docketNumbers = [group.leadDocketNumber, group.memberDocketNumber];

  if (filer === 'privatePractitioner') {
    preparePrivatePractitionerConsolidatedFiler(group);
    return;
  }

  if (filer === 'irsPractitioner') {
    prepareIrsConsolidatedFiler(docketNumbers);
    return;
  }

  prepareDojConsolidatedFiler(docketNumbers);
}

export function getFilerTestIdForConsolidatedFiler(
  filer: ConsolidatedMotionFiler,
  group: ConsolidatedGroupFixture,
): string {
  if (filer === 'privatePractitioner') {
    return getPrivatePractitionerFilerTestId(group);
  }

  return getRespondentFilerTestId();
}

export function getMotionEventCodeForDocumentType(
  documentType: string,
): string {
  if (documentType === 'Motion for a New Trial') {
    return MOTION_FOR_NEW_TRIAL_EVENT_CODE;
  }

  return MOTION_FOR_CONTINUANCE_EVENT_CODE;
}

export function fileConsolidatedMotionOnGroup(
  leadDocketNumber: string,
  filer: ConsolidatedMotionFiler,
  group: ConsolidatedGroupFixture,
  options: {
    documentType?: string;
    supportingDocs?: string[];
  } = {},
): void {
  loginConsolidatedFiler(filer);
  fileMotionOnGroup(leadDocketNumber, {
    documentType: options.documentType,
    filerTestId: getFilerTestIdForConsolidatedFiler(filer, group),
    supportingDocs: options.supportingDocs,
  });
}
