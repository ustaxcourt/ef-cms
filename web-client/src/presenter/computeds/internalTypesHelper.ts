import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { INTERNAL_DOCUMENTS_ARRAY } from '@shared/business/entities/EntityConstants';
import { InternalFilingEvent } from '@shared/business/entities/docketEntry/internalFilingEvents';

export const getDocumentTypesForSelect = <T>(
  documents: ({ documentType: string; eventCode: string } & T)[],
): (T & {
  label: string;
  value: string;
})[] => {
  const filteredTypeList = documents.map(t => {
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
    const [a, b] = [first.value.toUpperCase(), second.value.toUpperCase()];
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
    const [x, y] = [first.label, second.label];
    return x.localeCompare(y, { sensitivity: 'base' }); // a == A
  };
};

export const internalTypesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  internalDocumentTypesForSelectSorted: (InternalFilingEvent & {
    label: string;
    value: string;
  })[];
  internalDocumentTypesForSelectWithLegacySorted: (InternalFilingEvent & {
    label: string;
    value: string;
  })[];
} => {
  const { LODGED_EVENT_CODE } = applicationContext.getConstants();
  const searchText = get(state.screenMetadata.searchText) || '';

  const internalDocumentTypesForSelect = getDocumentTypesForSelect(
    INTERNAL_DOCUMENTS_ARRAY,
  );

  const internalDocumentTypesForSelectWithLegacySorted =
    internalDocumentTypesForSelect
      .sort(getSortFunction(searchText))
      .filter(d => d.eventCode !== LODGED_EVENT_CODE)
      .filter(d => !d?.deprecated);

  const internalDocumentTypesForSelectSorted =
    internalDocumentTypesForSelectWithLegacySorted;

  return {
    internalDocumentTypesForSelectSorted,
    internalDocumentTypesForSelectWithLegacySorted,
  };
};
