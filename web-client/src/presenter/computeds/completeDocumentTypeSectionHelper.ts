import { Case } from '@shared/business/entities/cases/Case';
import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'cerebral';
import {
  EXTERNAL_FILING_EVENTS,
  ExternalFilingEvent,
} from '@shared/business/entities/docketEntry/externalFilingEvents';
import {
  EXTERNAL_DOCUMENTS_ARRAY,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';

export const completeDocumentTypeSectionHelper = (
  get: Get,
): {
  primary?: any;
  secondary?: any;
  documentTypesForSelectSorted?: (ExternalFilingEvent & {
    label: string;
    value: string;
  })[];
  documentTypesForSecondarySelectSorted?: (ExternalFilingEvent & {
    label: string;
    value: string;
  })[];
} => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const user = get(state.user);
  if (isEmpty(caseDetail)) {
    return {};
  }

  const searchText = get(state.screenMetadata.searchText) || '';
  const documentTypesForSelect = getDocumentTypesForSelect(
    EXTERNAL_DOCUMENTS_ARRAY,
  );

  const documentTypesForSelectSorted = documentTypesForSelect
    .sort(getSortFunction(searchText))
    .filter(documentType => {
      if (documentType?.deprecated) {
        return false;
      }

      const currentUser = get(state.user);
      if (currentUser.role === ROLES.irsPractitioner) {
        if (
          Case.isFirstIrsFiling(caseDetail) &&
          !documentType.canBeFirstIrsDocument
        )
          return false;

        if (
          !Case.isFirstIrsFiling(caseDetail) &&
          documentType.eventCode === 'EA'
        )
          return false;
      } else if (documentType.eventCode === 'EA') return false;

      return !NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES.includes(
        documentType.eventCode,
      );
    })
    .map(documentType => {
      return {
        ...documentType,
        documentTitle:
          get(state.user).role === ROLES.irsPractitioner &&
          documentType.eventCode === 'EA'
            ? `${documentType.documentTitle} for Respondent`
            : documentType.documentTitle,
      };
    });
  const documentTypesForSecondarySelectSorted =
    documentTypesForSelectSorted.filter(
      entry => entry.scenario !== 'Nonstandard H',
    );

  const selectedDocumentCategory: keyof typeof EXTERNAL_FILING_EVENTS =
    form.category;
  const selectedDocumentType = form.documentType;
  const categoryInformation = (
    EXTERNAL_FILING_EVENTS[selectedDocumentCategory] || []
  ).find(entry => entry.documentType === selectedDocumentType);

  const selectedDocketEntryId = get(state.docketEntryId);

  const primary = getOptionsForCategory({
    caseDetail,
    categoryInformation,
    selectedDocketEntryId,
    authorizedUser: user,
  });
  let secondary;
  if (primary.showSecondaryDocumentSelect) {
    secondary = {};
    primary.showSecondaryDocumentSelect = false;
  }

  if (form.secondaryDocument) {
    const selectedSecondaryDocumentCategory = form.secondaryDocument.category;
    const selectedSecondaryDocumentType = form.secondaryDocument.documentType;

    if (selectedSecondaryDocumentCategory && selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = EXTERNAL_FILING_EVENTS[
        selectedSecondaryDocumentCategory
      ].find(entry => entry.documentType === selectedSecondaryDocumentType);

      secondary = getOptionsForCategory({
        caseDetail,
        categoryInformation: secondaryCategoryInformation,
        selectedDocketEntryId,
        authorizedUser: user,
      });
    }
  }

  return {
    documentTypesForSecondarySelectSorted,
    documentTypesForSelectSorted,
    primary,
    secondary,
  };
};
