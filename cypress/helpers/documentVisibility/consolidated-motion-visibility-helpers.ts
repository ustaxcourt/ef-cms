import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
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
import { attachFile } from '../file/upload-file';
import { createAndServePaperPetition } from '../fileAPetition/create-and-serve-paper-petition';
import {
  getDocketEntriesByEventCodeForCase,
  getDocketEntryByEventCodeForCase,
} from './motion-visibility-docket-entry-helpers';
import {
  fileIrsAnswer,
  fileMotionOnGroup,
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MOTION_FOR_NEW_TRIAL_EVENT_CODE,
  MotionVisibilityDocketEntries,
  MotionVisibilityPublicDocketEntry,
} from './practitioner-filed-motion-visibility-helpers';

const DOJ_RESPONDENT_BAR_NUMBER = 'WN7777';
const BRIEF_IN_SUPPORT_DOCUMENT_TYPE = 'Brief in Support';
const MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE = 'Memorandum in Support';
const DEFAULT_SECONDARY_MOTION_TYPE = 'Motion for Continuance';

export type ConsolidatedGroupFixture = {
  leadDocketNumber: string;
  leadPetitionerName: string;
  memberDocketNumber: string;
  memberPetitionerName: string;
};

export type ConsolidatedMotionFiler =
  'dojPractitioner' | 'irsPractitioner' | 'privatePractitioner';

export function createConsolidatedGroupWithOneMember(): Cypress.Chainable<ConsolidatedGroupFixture> {
  const leadPetitionerName = `ConsolidatedLead ${getCurrentDateTimeInMillis()}`;
  const memberPetitionerName = `ConsolidatedMember ${getCurrentDateTimeInMillis()}`;

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

export function getEFiledMotionOnCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getDocketEntryByEventCodeForCase(docketNumber, motionEventCode, false);
}

export function getMotionVisibilityDocketEntriesForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityDocketEntries> {
  return getEFiledMotionOnCase(docketNumber, motionEventCode).then(motion =>
    getDocketEntriesByEventCodeForCase(docketNumber, 'BRF', false).then(
      briefEntries => {
        const briefInSupport = briefEntries.find(
          entry => entry.index > motion.index,
        );

        return getDocketEntriesByEventCodeForCase(
          docketNumber,
          'MISP',
          false,
        ).then(memorandumEntries => {
          const memorandaInSupport = memorandumEntries.find(
            entry => entry.index > motion.index,
          );

          if (!briefInSupport || !memorandaInSupport) {
            throw new Error('Supporting documents for motion were not found');
          }

          return {
            motion,
            briefInSupport,
            memorandaInSupport,
          };
        });
      },
    ),
  );
}

export function getMotionAndSupportingEntriesForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<{
  motion: MotionVisibilityPublicDocketEntry;
  supportingEntries: MotionVisibilityPublicDocketEntry[];
}> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries = response?.body.docketEntries;
    const motionEntry = docketEntries.find(
      (entry: { eventCode: string; isPaper?: boolean }) =>
        entry.eventCode === motionEventCode && !entry.isPaper,
    );

    if (!motionEntry) {
      throw new Error(`Motion ${motionEventCode} was not found`);
    }

    const motion: MotionVisibilityPublicDocketEntry = {
      docketEntryId: motionEntry.docketEntryId,
      index: motionEntry.index,
      eventCode: motionEntry.eventCode,
    };

    const supportingEntries = docketEntries
      .filter(
        (entry: { eventCode: string; index: number }) =>
          (entry.eventCode === 'BRF' || entry.eventCode === 'MISP') &&
          entry.index > motion.index,
      )
      .map(
        (entry: {
          docketEntryId: string;
          index: number;
          eventCode: string;
        }) => ({
          docketEntryId: entry.docketEntryId,
          index: entry.index,
          eventCode: entry.eventCode,
        }),
      )
      .sort(
        (
          a: MotionVisibilityPublicDocketEntry,
          b: MotionVisibilityPublicDocketEntry,
        ) => a.index - b.index,
      );

    return { motion, supportingEntries };
  });
}

export type FileSupportInSupportOfMotionOnGroupOptions = {
  documentType: 'Brief in Support' | 'Memorandum in Support';
  filerTestId: string;
  motionDocumentType?: string;
};

export function fileSupportInSupportOfMotionOnGroup(
  leadDocketNumber: string,
  options: FileSupportInSupportOfMotionOnGroupOptions,
): void {
  const motionDocumentType =
    options.motionDocumentType ?? DEFAULT_SECONDARY_MOTION_TYPE;

  goToCase(leadDocketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();

  selectTypeaheadInput(
    'complete-doc-document-type-search',
    options.documentType,
  );
  cy.get('[data-testid="submit-document"]').click();

  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });

  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  cy.get('[data-testid="previous-document-search"]')
    .find('option')
    .then($options => {
      const matchingOption = Array.from($options).find(option =>
        option.textContent?.includes(motionDocumentType),
      );
      const optionText = matchingOption?.textContent?.trim() || '';
      cy.get('[data-testid="previous-document-search"]').select(optionText);
    });

  cy.get('#consolidated-group-all').check({ force: true });
  cy.get(`[data-testid="${options.filerTestId}"]`).click();
  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}

export type FileLeaveWithLodgedSecondaryOnGroupOptions = {
  filerTestId: string;
  primaryDocumentType?: string;
  primarySupportingDocs?: string[];
  secondaryDocumentType?: string;
  secondarySupportingDocs?: string[];
};

export function fileLeaveWithLodgedSecondaryOnGroup(
  leadDocketNumber: string,
  options: FileLeaveWithLodgedSecondaryOnGroupOptions,
): void {
  const primaryDocumentType =
    options.primaryDocumentType ?? 'Motion for Leave to File';
  const primarySupportingDocs = options.primarySupportingDocs ?? [
    BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
    MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
  ];
  const secondaryDocumentType =
    options.secondaryDocumentType ?? DEFAULT_SECONDARY_MOTION_TYPE;
  const secondarySupportingDocs = options.secondarySupportingDocs ?? [
    BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
    MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
  ];

  goToCase(leadDocketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();

  selectTypeaheadInput(
    'complete-doc-document-type-search',
    primaryDocumentType,
  );
  selectTypeaheadInput(
    'secondary-doc-secondary-document-type',
    secondaryDocumentType,
  );
  cy.get('[data-testid="submit-document"]').click();

  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="primaryDocument-objections-No"]').click();

  primarySupportingDocs.forEach((supportingDocType, index) => {
    cy.get('#add-supporting-document-button').click();
    cy.get(`#supporting-document-${index}`).select(supportingDocType);
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: `[data-testid="supporting-document-file-${index}"]`,
      selectorToAwaitOnSuccess: `[data-testid="upload-file-success-supporting-document-file-${index}"]`,
    });
  });

  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="secondary-document"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-secondary-document"]',
  });
  cy.get('[data-testid="secondaryDocument-objections-No"]').click();

  secondarySupportingDocs.forEach((supportingDocType, index) => {
    cy.get('#add-secondary-supporting-document-button').click();
    cy.get(`#secondary-supporting-document-${index}`).select(supportingDocType);
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: `[data-testid="secondary-supporting-document-file-${index}"]`,
      selectorToAwaitOnSuccess: `[data-testid="upload-file-success-secondary-supporting-document-file-${index}"]`,
    });
  });

  cy.get('#consolidated-group-all').check({ force: true });
  cy.get(`[data-testid="${options.filerTestId}"]`).click();
  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
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
