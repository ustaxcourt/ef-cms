import { selectTypeaheadInput } from '../components/typeAhead/select-typeahead-input';
import { attachFile } from '../file/upload-file';
import { goToCase } from '../caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsIrsPractitioner,
} from '../authentication/login-as-helpers';
import {
  BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  DEFAULT_MOTION_DOCUMENT_TYPE,
  DEFAULT_SUPPORTING_DOCUMENT_TYPES,
  MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
} from './motion-visibility-constants';

const SAMPLE_PDF = '../../helpers/file/sample.pdf';

export const selectPreviousDocumentOptionContaining = (text: string): void => {
  cy.get('[data-testid="previous-document-search"]')
    .find('option')
    .then($options => {
      const matchingOption = Array.from($options).find(option =>
        option.textContent?.includes(text),
      );
      const optionText = matchingOption?.textContent?.trim() || '';
      cy.get('[data-testid="previous-document-search"]').select(optionText);
    });
};

export function startFileDocumentFlow(docketNumber: string): void {
  goToCase(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
}

export function attachPrimarySampleDocument(): void {
  attachFile({
    filePath: SAMPLE_PDF,
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
}

export function attachSecondarySampleDocument(): void {
  attachFile({
    filePath: SAMPLE_PDF,
    selector: '[data-testid="secondary-document"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-secondary-document"]',
  });
}

export function attachPrimarySupportingDocuments(
  supportingDocs: string[],
): void {
  supportingDocs.forEach((supportingDocType, index) => {
    cy.get('#add-supporting-document-button').click();
    cy.get(`#supporting-document-${index}`).select(supportingDocType);
    attachFile({
      filePath: SAMPLE_PDF,
      selector: `[data-testid="supporting-document-file-${index}"]`,
      selectorToAwaitOnSuccess: `[data-testid="upload-file-success-supporting-document-file-${index}"]`,
    });
  });
}

export function attachSecondarySupportingDocuments(
  supportingDocs: string[],
): void {
  supportingDocs.forEach((supportingDocType, index) => {
    cy.get('#add-secondary-supporting-document-button').click();
    cy.get(`#secondary-supporting-document-${index}`).select(supportingDocType);
    attachFile({
      filePath: SAMPLE_PDF,
      selector: `[data-testid="secondary-supporting-document-file-${index}"]`,
      selectorToAwaitOnSuccess: `[data-testid="upload-file-success-secondary-supporting-document-file-${index}"]`,
    });
  });
}

export function selectFilerAndSubmitFileDocument(
  filerTestId: string,
  options: { fileOnConsolidatedGroup?: boolean } = {},
): void {
  if (options.fileOnConsolidatedGroup) {
    cy.get('#consolidated-group-all').check({ force: true });
  }

  cy.get(`[data-testid="${filerTestId}"]`).click();
  cy.get('[data-testid="file-document-submit-document"]').click();
  submitFileDocumentWithRedaction();
}

export function submitFileDocumentWithRedaction(): void {
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}

export function fileIrsAnswer(docketNumber: string): void {
  loginAsIrsPractitioner();
  goToCase(docketNumber);
  cy.get('[data-testid="button-first-irs-document"]').click();
  selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  cy.get('[data-testid="file-document-submit-document"]').click();
  submitFileDocumentWithRedaction();
}

export function qcDocument(docketNumber: string): void {
  loginAsDocketClerk1();
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
  cy.get(`[data-testid=work-item-${docketNumber}]`)
    .find(`[data-testid=work-item-document-link-${docketNumber}]`)
    .first()
    .click();
  cy.get('[data-testid="save-and-finish-document-qc"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
}

export function strikeDocketEntryByEventCode(eventCode: string): void {
  cy.get(`[data-testid="edit-${eventCode}"]`).click();
  cy.get('[data-testid="tab-action"]').click();
  cy.get('[data-testid="strike-entry"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
}

export function lodgeDocketEntryByEventCode(eventCode: string): void {
  cy.get(`[data-testid="edit-${eventCode}"]`).click();
  cy.get('[data-testid="filing-status-Lodge"]').click();
  cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
}

export function setDocketEntryFilingStatusByEventCode(eventCode: string): void {
  cy.get(`[data-testid="edit-${eventCode}"]`).click();
  cy.get('#filing-status-File').click();
  cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
}

export function docketClerkCompletesSectionQcChangingLodgeToFile(
  docketNumber: string,
  documentTitleContains: string,
): void {
  loginAsDocketClerk1();
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
  cy.contains(
    `[data-testid="work-item-document-link-${docketNumber}"]`,
    documentTitleContains,
  ).click();
  cy.get('#filing-status-File').click();
  cy.get('[data-testid="save-and-finish-document-qc"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}

export type FileMotionAndSupportsOptions = {
  documentType?: string;
  fileOnConsolidatedGroup?: boolean;
  filerTestId: string;
  supportingDocs?: string[];
};

export function fileMotionAndSupports(
  docketNumber: string,
  options: FileMotionAndSupportsOptions,
): void {
  const documentType = options.documentType ?? DEFAULT_MOTION_DOCUMENT_TYPE;
  const supportingDocs =
    options.supportingDocs ?? DEFAULT_SUPPORTING_DOCUMENT_TYPES;

  startFileDocumentFlow(docketNumber);
  selectTypeaheadInput('complete-doc-document-type-search', documentType);
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  attachPrimarySupportingDocuments(supportingDocs);
  selectFilerAndSubmitFileDocument(options.filerTestId, {
    fileOnConsolidatedGroup: options.fileOnConsolidatedGroup,
  });
}

export function fileMotionOnGroup(
  leadDocketNumber: string,
  options: FileMotionAndSupportsOptions,
): void {
  fileMotionAndSupports(leadDocketNumber, {
    ...options,
    fileOnConsolidatedGroup: true,
  });
}

export function fileAMotionAndSupportingDocuments(
  docketNumber: string,
  filerTestId: string,
): void {
  fileMotionAndSupports(docketNumber, { filerTestId });
}

export function fileMotionOnly(
  docketNumber: string,
  filerTestId: string,
  documentType: string = DEFAULT_MOTION_DOCUMENT_TYPE,
): void {
  fileMotionAndSupports(docketNumber, {
    documentType,
    filerTestId,
    supportingDocs: [],
  });
}

export function fileBriefInSupportOfMotion(
  docketNumber: string,
  filerTestId: string,
): void {
  startFileDocumentFlow(docketNumber);
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  );
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  selectPreviousDocumentOptionContaining(DEFAULT_MOTION_DOCUMENT_TYPE);
  selectFilerAndSubmitFileDocument(filerTestId);
}

export function fileMotionForLeave(
  docketNumber: string,
  filerTestId: string,
): void {
  startFileDocumentFlow(docketNumber);
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    'Motion for Leave to File',
  );
  selectTypeaheadInput(
    'secondary-doc-secondary-document-type',
    DEFAULT_MOTION_DOCUMENT_TYPE,
  );
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  attachSecondarySampleDocument();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  cy.get('[data-testid="secondaryDocument-objections-No"]').click();
  selectFilerAndSubmitFileDocument(filerTestId);
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
    options.motionDocumentType ?? DEFAULT_MOTION_DOCUMENT_TYPE;

  startFileDocumentFlow(leadDocketNumber);
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    options.documentType,
  );
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  selectPreviousDocumentOptionContaining(motionDocumentType);
  selectFilerAndSubmitFileDocument(options.filerTestId, {
    fileOnConsolidatedGroup: true,
  });
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
    options.secondaryDocumentType ?? DEFAULT_MOTION_DOCUMENT_TYPE;
  const secondarySupportingDocs = options.secondarySupportingDocs ?? [
    BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
    MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
  ];

  startFileDocumentFlow(leadDocketNumber);
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    primaryDocumentType,
  );
  selectTypeaheadInput(
    'secondary-doc-secondary-document-type',
    secondaryDocumentType,
  );
  cy.get('[data-testid="submit-document"]').click();
  attachPrimarySampleDocument();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  attachPrimarySupportingDocuments(primarySupportingDocs);
  attachSecondarySampleDocument();
  cy.get('[data-testid="secondaryDocument-objections-No"]').click();
  attachSecondarySupportingDocuments(secondarySupportingDocs);
  selectFilerAndSubmitFileDocument(options.filerTestId, {
    fileOnConsolidatedGroup: true,
  });
}
