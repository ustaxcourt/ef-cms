import { flatten, orderBy, values } from 'lodash';
import { state } from 'cerebral';

export const getInternalDocumentTypesForSelect = typeMap => {
  let filteredTypeList = flatten(values(typeMap)).map(t => {
    return { label: t.documentType, value: t.eventCode };
  });
  return orderBy(filteredTypeList, ['label'], ['asc']);
};

export const getSortFunction = searchText => {
  const str = searchText.toUpperCase();
  return (first, second) => {
    let { a, b } = [
      first.eventCode.toUpperCase(),
      second.eventCode.toUpperCase(),
    ];
    if (a.indexOf(str) == 0 && b.indexOf(str) != 0) {
      return -1;
    }
    if (b.indexOf(str) == 0 && a.indexOf(str) != 0) {
      return 1;
    }
    return 0;
  };
};

export const internalTypesHelper = get => {
  const { INTERNAL_CATEGORY_MAP } = get(state.constants);
  // const searchText = 'aa'; // get(state.searchText);

  const internalDocumentTypesForSelect = getInternalDocumentTypesForSelect(
    INTERNAL_CATEGORY_MAP,
  );

  return {
    internalDocumentTypesForSelect,
  };
};
