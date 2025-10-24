/* eslint-disable complexity */
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';

/**
 * Returns computed values for the confirm initiate court issued filing service modal
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * @returns {object} the computed values
 */

export const confirmInitiateServiceModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  canServeAcrossGroup: boolean;
  confirmationText: string;
  paperFilingText: string;
  showConsolidatedCasesForService: boolean;
  additionalServedCases: { docketNumber: string; caseTitle: string }[];
  contactsNeedingPaperService?: {
    contactId?: string;
    userId?: string;
    name: string;
    contactType?: string;
    serviceIndicator: string;
    docketNumber: string;
  }[];
} => {
  const {
    NON_MULTI_DOCKETABLE_EVENT_CODES,
    SIMULTANEOUS_DOCUMENT_EVENT_CODES,
  } = applicationContext.getConstants();
  const { isCourtIssued } = applicationContext.getUtilities();

  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const form = get(state.form);
  const isOnMessageDetailPage = get(state.currentPage) === 'MessageDetail';
  let { documentTitle, eventCode } = form;
  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (!eventCode) {
    ({ documentTitle, eventCode } = currentDocketEntry);
  }

  const { isFiledAcrossAllCases, processingStatus } = currentDocketEntry;

  const hasFiledAcrossGroup =
    isLeadCase(formattedCaseDetail) && isFiledAcrossAllCases;

  const canFileAcrossGroup =
    processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING &&
    isLeadCase(formattedCaseDetail);

  const canServeAcrossGroup = canFileAcrossGroup || hasFiledAcrossGroup;

  let showConsolidatedCasesForService =
    formattedCaseDetail.isLeadCase &&
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode) &&
    !isOnMessageDetailPage;

  if (!isCourtIssued(eventCode)) {
    if (
      SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(eventCode) ||
      documentTitle?.includes('Simultaneous')
    ) {
      showConsolidatedCasesForService = false;
    }
  }

  let additionalServedCases: { docketNumber: string; caseTitle: string }[] = [];
  if (hasFiledAcrossGroup) {
    if (Array.isArray(formattedCaseDetail.consolidatedCases)) {
      additionalServedCases = formattedCaseDetail.consolidatedCases
        .filter((c: any) => c.docketNumber !== formattedCaseDetail.docketNumber)
        .map((c: any) => ({
          docketNumber: c.docketNumber,
          caseTitle: c.caseTitle,
        }));
    }
  }

  const confirmationText = showConsolidatedCasesForService
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  if (showConsolidatedCasesForService) {
    const modalForm = get(state.modal.form) || {};
    const consolidatedCasesToMultiDocketOn =
      modalForm.consolidatedCasesToMultiDocketOn || [];
    const paperServiceParties: {
      contactId: string;
      userId: string;
      name: string;
    }[] = [];

    consolidatedCasesToMultiDocketOn.forEach(aCase => {
      if (aCase.checked) {
        const caseDetail = [
          ...formattedCaseDetail.consolidatedCases,
          formattedCaseDetail,
        ].find(
          checkboxCase => checkboxCase.docketNumber === aCase.docketNumber,
        );

        const checkboxPaperServiceParties = getPaperServiceParties(caseDetail);
        paperServiceParties.push(...checkboxPaperServiceParties);
      }
    });
  }

  const contactsNeedingPaperService: {
    contactId?: string;
    userId?: string;
    name: string;
    contactType?: string;
    serviceIndicator: string;
    docketNumber: string;
  }[] = [];

  const casesToIterateOver = canServeAcrossGroup
    ? formattedCaseDetail.consolidatedCases
    : [formattedCaseDetail];

  for (const caseItem of casesToIterateOver) {
    const {
      irsPractitioners = [],
      petitioners = [],
      privatePractitioners = [],
      docketNumber,
    } = caseItem;

    const allParties = [
      ...irsPractitioners,
      ...petitioners,
      ...privatePractitioners,
    ];

    allParties
      .filter(
        person => person.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
      )
      .forEach(person => {
        contactsNeedingPaperService.push({
          ...person,
          docketNumber,
        });
      });
  }
  // should we use canServeAcrossGroup here instead?
  const paperFilingText = hasFiledAcrossGroup
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  return {
    canServeAcrossGroup,
    confirmationText,
    paperFilingText,
    showConsolidatedCasesForService,
    additionalServedCases,
    contactsNeedingPaperService:
      contactsNeedingPaperService.length > 0
        ? contactsNeedingPaperService
        : undefined,
  };
};

const getPaperServiceParties = rawCase => {
  const allParties = [
    ...(rawCase.irsPractitioners || []),
    ...(rawCase.petitioners || []),
    ...(rawCase.privatePractitioners || []),
  ];

  const paperServiceParties = allParties.filter(
    person => person.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  return paperServiceParties;
};
