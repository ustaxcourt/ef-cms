import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { roleToDisplay } from './confirmInitiateServiceModalHelper';
import { FormattedCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export type ContactsNeedingPaperService = {
  name: string;
  formattedContactType?: string;
  docketNumber: string;
}[];

export const confirmPaperServiceModalHelper = (
  get: Get,
): {
  wasMultiDocketed: boolean;
  multiDocketedOn: FormattedCase[];
  paperFilingText: string;
  contactsNeedingPaperService?: ContactsNeedingPaperService;
} => {
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const paperServiceParties = get(state.paperServiceParties);

  const currentDocketEntry = formattedCaseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (!currentDocketEntry) {
    if (!docketEntryId) {
      const contactsNeedingPaperService: ContactsNeedingPaperService = [];

      (paperServiceParties || []).forEach(person => {
        contactsNeedingPaperService.push({
          name: person.name,
          formattedContactType: roleToDisplay(person),
          docketNumber: person.docketNumber,
        });
      });

      return {
        wasMultiDocketed: false,
        multiDocketedOn: [],
        paperFilingText: 'This case has parties receiving paper service:',
        contactsNeedingPaperService,
      };
    }

    throw new Error(`Docket entry ${docketEntryId} was not found.`);
  }

  const wasMultiDocketed = DocketEntry.isMultiDocketed(currentDocketEntry);

  const multiDocketedOn = formattedCaseDetail.consolidatedCases.filter(c =>
    currentDocketEntry.multiDocketedOn.includes(c.docketNumber),
  );

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
