import { find } from 'lodash';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  const { eventCode, isStricken, strickenAt, strickenBy } = get(state.form);

  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const { INTERNAL_CATEGORY_MAP } = applicationContext.getConstants();

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const amendmentEventCodes = ['AMAT', 'ADMT'];

  let categoryInformation;
  find(
    INTERNAL_CATEGORY_MAP,
    entries => (categoryInformation = find(entries, { eventCode: eventCode })),
  );

  const optionsForCategory = getOptionsForCategory(
    applicationContext,
    caseDetail,
    categoryInformation,
  );

  const strickenAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(strickenAt, 'MMDDYYYY');

  return {
    isStricken,
    primary: optionsForCategory,
    showObjection:
      objectionDocumentTypes.includes(form.documentType) ||
      (amendmentEventCodes.includes(form.eventCode) &&
        objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    strickenAtFormatted,
    strickenBy,
  };
};
