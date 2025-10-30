import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  CONTACT_TYPE_TITLES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';

/**
 * Returns computed values for the confirm initiate court issued filing service modal
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * @returns {object} the computed values
 */

type ContactsNeedingPaperService = {
  name: string;
  formattedContactType?: string;
  docketNumber: string;
}[];

export const confirmInitiateServiceModalHelper = (
  get: Get,
): {
  canFileAcrossGroup: boolean;
  canServeAcrossGroup: boolean;
  confirmationText: string;
  paperFilingText: string;
  additionalServedCases: { docketNumber: string; caseTitle: string }[];
  contactsNeedingPaperService?: ContactsNeedingPaperService;
} => {
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const form = get(state.form);
  let { eventCode, isFiledAcrossAllCases } = form;
  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (!eventCode) {
    ({ eventCode, isFiledAcrossAllCases } = currentDocketEntry);
  }

  const hasFiledAcrossGroup =
    isLeadCase(formattedCaseDetail) && !!isFiledAcrossAllCases;

  const canFileAcrossGroup =
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode) &&
    isLeadCase(formattedCaseDetail);

  const canServeAcrossGroup = canFileAcrossGroup || hasFiledAcrossGroup;

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

  const confirmationText = canFileAcrossGroup
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  const contactsNeedingPaperService: ContactsNeedingPaperService = [];

  let casesToIterateOver: any[] = [];

  if (hasFiledAcrossGroup) {
    casesToIterateOver = formattedCaseDetail.consolidatedCases;
  } else if (canFileAcrossGroup) {
    const checkedCases = get(state.modal.form.consolidatedCasesToMultiDocketOn)
      .filter(consolidatedCase => consolidatedCase.checked)
      .map(consolidatedCase => consolidatedCase.docketNumber);

    casesToIterateOver = formattedCaseDetail.consolidatedCases.filter(cc => {
      return checkedCases.includes(cc.docketNumber);
    });
  } else {
    casesToIterateOver = [formattedCaseDetail];
  }

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
          name: person.name,
          formattedContactType: roleToDisplay(person),
          docketNumber,
        });
      });
  }

  const paperFilingText = canFileAcrossGroup
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  return {
    canFileAcrossGroup,
    canServeAcrossGroup,
    confirmationText,
    paperFilingText,
    additionalServedCases,
    contactsNeedingPaperService:
      contactsNeedingPaperService.length > 0
        ? contactsNeedingPaperService
        : undefined,
  };
};

const roleToDisplay = party => {
  if (party.role === ROLES.privatePractitioner) {
    return 'Petitioner Counsel';
  } else if (party.role === ROLES.irsPractitioner) {
    return 'Respondent Counsel';
  } else {
    return CONTACT_TYPE_TITLES[party.contactType];
  }
};
