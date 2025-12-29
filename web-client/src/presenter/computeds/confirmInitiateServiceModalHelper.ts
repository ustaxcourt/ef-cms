import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  CONTACT_TYPE_TITLES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';

export type ContactsNeedingPaperService = {
  name: string;
  formattedContactType?: string;
  docketNumber: string;
}[];

export const confirmInitiateServiceModalHelper = (
  get: Get,
): {
  canShowCheckboxes: boolean;
  canMultiDocket: boolean;
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

  let isFiling = true;

  if (!eventCode) {
    isFiling = false;
    ({ eventCode, multiDocketedOn } = currentDocketEntry);
  }

  const isLead = isLeadCase(formattedCaseDetail);

  const isMultiDocketed = multiDocketedOn?.length > 1;

  const canMultiDocket =
    isLead &&
    !isMultiDocketed &&
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode);

  const canShowCheckboxes = isLead && (isFiling || isMultiDocketed);

  const checkedCases = (
    get(state.modal.form.consolidatedCasesToMultiDocketOn) || []
  )
    .filter(c => c.checked)
    .map(c => c.docketNumber);

  let additionalServedCases: { docketNumber: string; caseTitle: string }[] = [];
  let casesToIterateOver: any[] = [];

  if (canShowCheckboxes) {
    additionalServedCases = formattedCaseDetail.consolidatedCases
      .filter(c => checkedCases.includes(c.docketNumber))
      .filter(c => c.docketNumber !== formattedCaseDetail.docketNumber)
      .map(c => ({
        docketNumber: c.docketNumber,
        caseTitle: c.caseTitle,
      }));

    casesToIterateOver = formattedCaseDetail.consolidatedCases.filter(c =>
      checkedCases.includes(c.docketNumber),
    );
  } else {
    additionalServedCases = [];
    casesToIterateOver = [formattedCaseDetail];
  }

  const contactsNeedingPaperService: ContactsNeedingPaperService = [];

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

  const paperFilingText = canShowCheckboxes
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  const confirmationText = canShowCheckboxes
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  return {
    canMultiDocket,
    canShowCheckboxes,
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
