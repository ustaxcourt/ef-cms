import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'cerebral';
import {
  AMENDMENT_EVENT_CODES,
  INTERNAL_DOCUMENT_TYPES_REQUIRING_OBJECTION,
  INTERNAL_DOCUMENTS_ARRAY,
} from '@shared/business/entities/EntityConstants';
import { formatDateString } from '@shared/business/utilities/DateHandler';

export const editDocketEntryMetaHelper = (
  get: Get,
): {
  isStricken: boolean;
  primary: any;
  showObjection: boolean;
  strickenAtFormatted: string;
  strickenBy: string;
} => {
  const { eventCode, isStricken, strickenAt, strickenBy } = get(state.form);

  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const user = get(state.user);

  const categoryInformation = INTERNAL_DOCUMENTS_ARRAY.find(
    d => d.eventCode === eventCode,
  );

  const selectedDocketEntryId = get(state.docketEntryId) as unknown as string;

  const optionsForCategory = getOptionsForCategory({
    caseDetail,
    categoryInformation,
    selectedDocketEntryId,
    authorizedUser: user,
  });

  if (optionsForCategory.showSecondaryDocumentSelect) {
    optionsForCategory.showSecondaryDocumentSelect = false;
    optionsForCategory.showSecondaryDocumentForm = true;
  }

  const strickenAtFormatted = formatDateString(strickenAt, 'MMDDYYYY');

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
