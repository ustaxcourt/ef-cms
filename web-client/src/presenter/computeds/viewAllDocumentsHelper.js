import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { state } from 'cerebral';

export const viewAllDocumentsHelper = get => {
  const { CATEGORIES, CATEGORY_MAP } = get(state.constants);
  const searchText = get(state.screenMetadata.searchText) || '';

  const documentTypesForSelect = getDocumentTypesForSelect(CATEGORY_MAP);

  const documentTypesForSelectSorted = documentTypesForSelect.sort(
    getSortFunction(searchText),
  );

  const sections = [...CATEGORIES];
  sections.push(sections.shift());
  console.log(CATEGORY_MAP);

  return {
    categoryMap: CATEGORY_MAP,
    documentTypesForSelect,
    documentTypesForSelectSorted,
    sections,
  };
};
