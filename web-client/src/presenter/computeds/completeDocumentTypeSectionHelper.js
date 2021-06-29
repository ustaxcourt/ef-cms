import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const completeDocumentTypeSectionHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  let returnData = {};

  if (isEmpty(caseDetail)) {
    return {};
  }
  const { CATEGORY_MAP } = applicationContext.getConstants();
  const searchText = get(state.screenMetadata.searchText) || '';
  const documentTypesForSelect = getDocumentTypesForSelect(CATEGORY_MAP);

  returnData.documentTypesForSelectSorted = documentTypesForSelect.sort(
    getSortFunction(searchText),
  );
  returnData.documentTypesForSecondarySelectSorted =
    returnData.documentTypesForSelectSorted.filter(
      entry => entry.scenario !== 'Nonstandard H',
    );

  const selectedDocumentCategory = form.category;
  const selectedDocumentType = form.documentType;
  const categoryInformation = (
    CATEGORY_MAP[selectedDocumentCategory] || []
  ).find(entry => entry.documentType === selectedDocumentType);

  const selectedDocketEntryId = get(state.docketEntryId);

  returnData.primary = getOptionsForCategory({
    applicationContext,
    caseDetail,
    categoryInformation,
    selectedDocketEntryId,
  });
  if (returnData.primary.showSecondaryDocumentSelect) {
    returnData.secondary = {};
    returnData.primary.showSecondaryDocumentSelect = false;
  }

  if (form.secondaryDocument) {
    const selectedSecondaryDocumentCategory = form.secondaryDocument.category;
    const selectedSecondaryDocumentType = form.secondaryDocument.documentType;

    if (selectedSecondaryDocumentCategory && selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = CATEGORY_MAP[
        selectedSecondaryDocumentCategory
      ].find(entry => entry.documentType === selectedSecondaryDocumentType);

      returnData.secondary = getOptionsForCategory({
        applicationContext,
        caseDetail,
        categoryInformation: secondaryCategoryInformation,
        selectedDocketEntryId,
      });
    }
  }

  return returnData;
};
