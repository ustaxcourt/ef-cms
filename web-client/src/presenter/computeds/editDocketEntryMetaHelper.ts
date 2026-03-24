import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'cerebral';
import {
  AMENDMENT_EVENT_CODES,
  INTERNAL_DOCUMENT_TYPES_REQUIRING_OBJECTION,
  INTERNAL_DOCUMENTS_ARRAY,
} from '@shared/business/entities/EntityConstants';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { isEmpty } from 'lodash';

export const editDocketEntryMetaHelper = (
  get: Get,
): {
  multiDocketedOn: {
    docketNumber: string;
    caseTitle: string;
  }[];
  isStricken: boolean;
  primary: any;
  showObjection: boolean;
  strickenAtFormatted: string;
  strickenBy: string;
  showEditHelpText: boolean;
} => {
  const { eventCode, isStricken, strickenAt, strickenBy } = get(state.form);

  const caseDetail =
    get(state.multiDocketedOriginalCaseDetail) ?? get(state.caseDetail);
  const formattedCaseDetail = get(state.formattedCaseDetail);
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

  const multiDocketedOn = formattedCaseDetail.consolidatedCases.filter(
    consolidatedCase =>
      consolidatedCase.docketNumber !== caseDetail.docketNumber &&
      form.multiDocketedOn.includes(consolidatedCase.docketNumber),
  );

  const showEditHelpText = !isEmpty(form) && DocketEntry.isMultiDocketed(form);

  return {
    multiDocketedOn,
    isStricken,
    primary: optionsForCategory,
    showObjection,
    strickenAtFormatted,
    strickenBy,
    showEditHelpText,
  };
};
