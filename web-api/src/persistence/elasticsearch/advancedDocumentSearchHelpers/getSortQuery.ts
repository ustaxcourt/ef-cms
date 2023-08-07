import { DOCUMENT_SEARCH_SORT } from '../../../../../shared/src/business/entities/EntityConstants';

export const getSortQuery = sortField => {
  let sort;
  let sortOrder = 'desc';

  if (
    [
      DOCUMENT_SEARCH_SORT.FILING_DATE_ASC,
      DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC,
    ].includes(sortField)
  ) {
    sortOrder = 'asc';
  }

  switch (sortField) {
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC:
      sort = [{ 'numberOfPages.N': sortOrder }];
      break;
    case DOCUMENT_SEARCH_SORT.FILING_DATE_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.FILING_DATE_DESC: // fall through
    default:
      sort = [{ 'filingDate.S': sortOrder }];
      break;
  }

  return sort;
};
