import { find } from 'lodash';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const editDocketEntryMetaHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { eventCode, isStricken, strickenAt, strickenBy } = get(state.form);

  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const { AMENDMENT_EVENT_CODES, INTERNAL_CATEGORY_MAP } =
    applicationContext.getConstants();

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  let categoryInformation;
  find(
    INTERNAL_CATEGORY_MAP,
    entries => (categoryInformation = find(entries, { eventCode })),
  );

  const selectedDocketEntryId = get(state.docketEntryId);

  const optionsForCategory = getOptionsForCategory({
    applicationContext,
    caseDetail,
    categoryInformation,
    selectedDocketEntryId,
  });

  if (optionsForCategory.showSecondaryDocumentSelect) {
    optionsForCategory.showSecondaryDocumentSelect = false;
    optionsForCategory.showSecondaryDocumentForm = true;
  }

  const strickenAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(strickenAt, 'MMDDYYYY');

  return {
    isStricken,
    primary: optionsForCategory,
    showObjection:
      objectionDocumentTypes.includes(form.documentType) ||
      (AMENDMENT_EVENT_CODES.includes(form.eventCode) &&
        objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    strickenAtFormatted,
    strickenBy,
  };
};
