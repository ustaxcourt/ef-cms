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

  const forSecondary = get(state.modal.forSecondary);
  let categoryMap = { ...CATEGORY_MAP };
  sections.forEach(section => {
    categoryMap[section] = categoryMap[section].filter(
      entry => !forSecondary || entry.scenario !== 'Nonstandard H',
    );
  });

  return {
    categoryMap,
    documentTypesForSelect,
    documentTypesForSelectSorted,
    sections,
  };
};
