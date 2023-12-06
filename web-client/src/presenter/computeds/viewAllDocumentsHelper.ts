import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const viewAllDocumentsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { CATEGORIES, CATEGORY_MAP } = applicationContext.getConstants();
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

  const reasons = [
    {
      categories: [
        {
          category: 'Application',
        },
        {
          category: 'Motion',
        },
        {
          category: 'Petition',
        },
      ],
      reason: 'Request something from the court',
    },
    {
      categories: [
        {
          category: 'Notice',
        },
        {
          category: 'Pretrial Memorandum',
        },
        {
          category: 'Seriatim Brief',
        },
        {
          category: 'Simultaneous Brief',
        },
        {
          category: 'Statement',
        },
        {
          category: 'Stipulation',
        },
      ],
      reason: 'Notify the court of a change',
    },
    {
      categories: [
        {
          category: 'Miscellaneous',
        },
        {
          category: 'Supporting Document',
        },
      ],
      reason: 'Update or add to a document',
    },
    {
      categories: [
        {
          category: 'Motion',
        },
        {
          category: 'Reply',
        },
        {
          category: 'Response, Opposition or Objection',
        },
      ],
      reason: 'Respond to a previous document',
    },
  ];

  return {
    categoryMap,
    documentTypesForSelect,
    documentTypesForSelectSorted,
    reasons,
    sections,
  };
};
