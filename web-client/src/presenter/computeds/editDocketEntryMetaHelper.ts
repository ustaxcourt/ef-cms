import { find } from 'lodash';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { INTERNAL_DOCUMENT_TYPES_REQUIRING_OBJECTION } from '@shared/business/entities/EntityConstants';
export const editDocketEntryMetaHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { eventCode, isStricken, strickenAt, strickenBy } = get(state.form);

  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const { AMENDMENT_EVENT_CODES, INTERNAL_CATEGORY_MAP } =
    applicationContext.getConstants();

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

  const showObjection =
    INTERNAL_DOCUMENT_TYPES_REQUIRING_OBJECTION.has(form.documentType) ||
    (AMENDMENT_EVENT_CODES.includes(form.eventCode) &&
      INTERNAL_DOCUMENT_TYPES_REQUIRING_OBJECTION.has(
        form.previousDocument?.documentType,
      ));

  return {
    isStricken,
    primary: optionsForCategory,
    showObjection,
    strickenAtFormatted,
    strickenBy,
  };
};
