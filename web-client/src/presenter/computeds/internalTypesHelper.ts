import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { flatten, orderBy, values } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentTypesForSelect = (
  typeMap,
): {
  documentTitleTemplate: string;
  documentType: string;
  eventCode: string;
  scenario: string;
  label: string;
  value: string;
}[] => {
  let filteredTypeList = flatten(values(typeMap)).map(t => {
    return { ...t, label: t.documentType, value: t.eventCode };
  });
  return orderBy(filteredTypeList, ['label'], ['asc']);
};

export const getSortFunction = searchText => {
  if (searchText.length === 0) {
    return (a, b) => a.label.localeCompare(b.label, { sensitivity: 'base' });
  }
  const str = searchText.toUpperCase();
  return (first, second) => {
    let [a, b] = [first.value.toUpperCase(), second.value.toUpperCase()];
    if (a == str) return -1; // exact match for a
    if (b == str) return 1; // exact match for b

    // first value begins with search string but second does not
    if (a.indexOf(str) == 0 && b.indexOf(str) != 0) {
      return -1;
    }

    // second value begins with search string but first does not
    if (b.indexOf(str) == 0 && a.indexOf(str) != 0) {
      return 1;
    }

    // neither has a "good match" for the value.
    // continue comparing labels without regard to search string
    let [x, y] = [first.label, second.label];
    return x.localeCompare(y, { sensitivity: 'base' }); // a == A
  };
};

export const internalTypesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { INTERNAL_CATEGORY_MAP, LEGACY_DOCUMENT_TYPES, LODGED_EVENT_CODE } =
    applicationContext.getConstants();
  const searchText = get(state.screenMetadata.searchText) || '';

  const internalDocumentTypesForSelect = getDocumentTypesForSelect(
    INTERNAL_CATEGORY_MAP,
  );

  const internalDocumentTypesForSelectWithLegacySorted =
    internalDocumentTypesForSelect
      .sort(getSortFunction(searchText))
      .filter(d => d.eventCode !== LODGED_EVENT_CODE);

  const legacyDocumentCodes = LEGACY_DOCUMENT_TYPES.map(
    value => value.eventCode,
  );

  const internalDocumentTypesForSelectSorted =
    internalDocumentTypesForSelectWithLegacySorted.filter(
      documentType =>
        legacyDocumentCodes.indexOf(documentType.eventCode) === -1,
    );

  return {
    internalDocumentTypesForSelectSorted,
    internalDocumentTypesForSelectWithLegacySorted,
  };
};
