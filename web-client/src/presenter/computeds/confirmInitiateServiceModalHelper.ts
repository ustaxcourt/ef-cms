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
  shouldAllowMultiDocketing: boolean;
  confirmationText: string;
  paperFilingText: string;
  additionalServedCases: { docketNumber: string; caseTitle: string }[];
  contactsNeedingPaperService?: ContactsNeedingPaperService;
} => {
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const form = get(state.form);
  let {
    eventCode,
    multiDocketedOn,
    multiDocketedOriginalDocketNumber,
    processingStatus,
  } = form;

  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (!eventCode) {
    ({
      eventCode,
      multiDocketedOn,
      multiDocketedOriginalDocketNumber,
      processingStatus,
    } = currentDocketEntry);
  }

  const isLead = isLeadCase(formattedCaseDetail);

  const shouldAllowMultiDocketing = shouldAllowMultiDocket({
    eventCode,
    multiDocketedOn,
    multiDocketedOriginalDocketNumber,
    processingStatus,
    isLead,
  });

  const checkedCases = (
    get(state.modal.form.consolidatedCasesToMultiDocketOn) || []
  )
    .filter(c => c.checked)
    .map(c => c.docketNumber);

  let additionalServedCases: { docketNumber: string; caseTitle: string }[] = [];
  let casesToIterateOver: any[] = [];

  if (shouldAllowMultiDocketing) {
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

  const paperFilingText = shouldAllowMultiDocketing
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  const confirmationText = shouldAllowMultiDocketing
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  return {
    shouldAllowMultiDocketing,
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

export const shouldAllowMultiDocket = ({
  eventCode,
  multiDocketedOn,
  multiDocketedOriginalDocketNumber,
  processingStatus,
  isLead,
}) => {
  const isSavedForLater =
    !multiDocketedOriginalDocketNumber && !!processingStatus;

  const isBeingFiledOrServed =
    !multiDocketedOriginalDocketNumber && !processingStatus;

  const isMultiDocketed = multiDocketedOn?.length > 1;

  const isMultiDocketableEvent =
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode);

  let shouldAllowMultiDocket = isLead && isMultiDocketableEvent;

  if (!isSavedForLater && !isMultiDocketed && !isBeingFiledOrServed) {
    shouldAllowMultiDocket = false;
  }

  return shouldAllowMultiDocket;
};
