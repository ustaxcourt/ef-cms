import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { roleToDisplay } from './confirmInitiateServiceModalHelper';

export type ContactsNeedingPaperService = {
  name: string;
  formattedContactType?: string;
  docketNumber: string;
}[];

export const confirmPaperServiceModalHelper = (
  get: Get,
): {
  wasMultiDocketed: boolean;
  multiDocketedOn: [];
  paperFilingText: string;
  contactsNeedingPaperService?: ContactsNeedingPaperService;
} => {
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const paperServiceParties = get(state.paperServiceParties);

  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  const wasMultiDocketed = currentDocketEntry.multiDocketedOn.length > 1;

  const multiDocketedOn = formattedCaseDetail.consolidatedCases.filter(c => {
    return currentDocketEntry.multiDocketedOn.includes(c.docketNumber);
  });

  const paperFilingText = wasMultiDocketed
    ? 'Paper service is required for these parties:'
    : 'This case has parties receiving paper service:';

  const contactsNeedingPaperService: ContactsNeedingPaperService = [];

  paperServiceParties.forEach(person => {
    contactsNeedingPaperService.push({
      name: person.name,
      formattedContactType: roleToDisplay(person),
      docketNumber: person.docketNumber,
    });
  });

  return {
    wasMultiDocketed,
    multiDocketedOn,
    paperFilingText,
    contactsNeedingPaperService,
  };
};
