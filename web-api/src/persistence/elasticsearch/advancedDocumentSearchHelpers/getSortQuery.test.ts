import { DOCUMENT_SEARCH_SORT } from '../../../../../shared/src/business/entities/EntityConstants';
import { getSortQuery } from './getSortQuery';

describe('getSortQuery', () => {
  it('sets sort to numberOfPages: asc when sortField is "DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC)).toEqual([
      { 'numberOfPages.N': 'asc' },
    ]);
  });

  it('sets sort to numberOfPages: asc when sortField is "DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC)).toEqual([
      { 'numberOfPages.N': 'desc' },
    ]);
  });

  it('sets sort to filingDate: desc when sortField is "DOCUMENT_SEARCH_SORT.FILING_DATE_ASC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.FILING_DATE_ASC)).toEqual([
      { 'filingDate.S': 'asc' },
    ]);
  });

  it('sets sort to filingDate: desc when sortField is "DOCUMENT_SEARCH_SORT.FILING_DATE_DESC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.FILING_DATE_DESC)).toEqual([
      { 'filingDate.S': 'desc' },
    ]);
  });

  it('sets sort to filingDate: desc by default', () => {
    expect(getSortQuery('TRASH')).toEqual([{ 'filingDate.S': 'desc' }]);
  });
});
