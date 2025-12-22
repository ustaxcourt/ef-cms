import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  CONTACT_TYPE_TITLES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';

export type ContactsNeedingPaperService = {
  name: string;
  formattedContactType?: string;
  docketNumber: string;
}[];

export const confirmInitiateServiceModalHelper = (
  get: Get,
): {
  canMultiDocket: boolean;
  canServeMultiDocketed: boolean;
  confirmationText: string;
  paperFilingText: string;
  additionalServedCases: { docketNumber: string; caseTitle: string }[];
  contactsNeedingPaperService?: ContactsNeedingPaperService;
} => {
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const form = get(state.form);
  let { eventCode, multiDocketedOn } = form;

  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (!eventCode) {
    ({ eventCode, multiDocketedOn } = currentDocketEntry);
  }

  const isMultiDocketed = multiDocketedOn?.length > 1;

  const canMultiDocket = !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode);

  const canServeMultiDocketed = canMultiDocket || isMultiDocketed;

  let additionalServedCases: { docketNumber: string; caseTitle: string }[] = [];

  if (isMultiDocketed) {
    if (Array.isArray(formattedCaseDetail.consolidatedCases)) {
      additionalServedCases = formattedCaseDetail.consolidatedCases
        .filter((c: any) => c.docketNumber !== formattedCaseDetail.docketNumber)
        .filter(c => multiDocketedOn.includes(c.docketNumber))
        .map((c: any) => ({
          docketNumber: c.docketNumber,
          caseTitle: c.caseTitle,
        }));
    }
  }

  const confirmationText = canMultiDocket
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  const contactsNeedingPaperService: ContactsNeedingPaperService = [];

  let casesToIterateOver: any[] = [];

  if (isMultiDocketed) {
    casesToIterateOver = formattedCaseDetail.consolidatedCases.filter(c => {
      multiDocketedOn.includes(c.docketNumber);
    });
  } else if (canMultiDocket) {
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

  const paperFilingText = canMultiDocket
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  return {
    canMultiDocket,
    canServeMultiDocketed,
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
