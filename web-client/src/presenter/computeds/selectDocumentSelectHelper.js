import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { state } from 'cerebral';

export const selectDocumentSelectHelper = (get, applicationContext) => {
  const { CATEGORY_MAP } = applicationContext.getConstants();
  const searchText = get(state.screenMetadata.searchText) || '';

  const documentTypesForSelect = getDocumentTypesForSelect(CATEGORY_MAP);

  const documentTypesForSelectSorted = documentTypesForSelect.sort(
    getSortFunction(searchText),
  );

  return {
    documentTypesForSelect,
    documentTypesForSelectSorted,
  };
};
