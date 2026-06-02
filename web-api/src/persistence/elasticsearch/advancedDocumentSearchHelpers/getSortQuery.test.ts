import {
  DOCUMENT_SEARCH_SORT,
  TODAYS_ORDERS_SORTS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { getSortQuery } from './getSortQuery';

describe('getSortQuery', () => {
  it('sets sort to numberOfPages: asc when sortField is "DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC)).toEqual([
      { 'numberOfPages.N': 'asc' },
    ]);
  });

  it('sets sort to numberOfPages: desc when sortField is "DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC)).toEqual([
      { 'numberOfPages.N': 'desc' },
    ]);
  });

  it('sets sort to filingDate: asc when sortField is "DOCUMENT_SEARCH_SORT.FILING_DATE_ASC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.FILING_DATE_ASC)).toEqual([
      { 'filingDate.S': 'asc' },
    ]);
  });

  it('sets sort to filingDate: desc when sortField is "DOCUMENT_SEARCH_SORT.FILING_DATE_DESC"', () => {
    expect(getSortQuery(DOCUMENT_SEARCH_SORT.FILING_DATE_DESC)).toEqual([
      { 'filingDate.S': 'desc' },
    ]);
  });

  it('sorts by caseCaption ascending when sortField is "TODAYS_ORDERS_SORTS.CASE_CAPTION_ASC"', () => {
    const result = getSortQuery(TODAYS_ORDERS_SORTS.CASE_CAPTION_ASC);
    expect(result).toEqual([
      {
        _script: {
          order: 'asc',
          script: {
            lang: 'painless',
            source:
              "doc['caseCaption.S.keyword'].size() > 0 ? doc['caseCaption.S.keyword'].value.toLowerCase() : ''",
          },
          type: 'string',
        },
      },
    ]);
  });

  it('sorts by caseCaption descending when sortField is "TODAYS_ORDERS_SORTS.CASE_CAPTION_DESC"', () => {
    const result = getSortQuery(TODAYS_ORDERS_SORTS.CASE_CAPTION_DESC);
    expect(result).toEqual([
      {
        _script: {
          order: 'desc',
          script: {
            lang: 'painless',
            source:
              "doc['caseCaption.S.keyword'].size() > 0 ? doc['caseCaption.S.keyword'].value.toLowerCase() : ''",
          },
          type: 'string',
        },
      },
    ]);
  });

  it('sorts by judge name ascending when sortField is "TODAYS_ORDERS_SORTS.JUDGE_NAME_ASC"', () => {
    const result = getSortQuery(TODAYS_ORDERS_SORTS.JUDGE_NAME_ASC);
    expect(result).toEqual([
      {
        _script: {
          order: 'asc',
          script: {
            lang: 'painless',
            source: expect.stringContaining("eventCode == 'SPOS'"),
          },
          type: 'string',
        },
      },
    ]);
    const { source } = result[0]._script.script;
    expect(source).toContain("doc['judge.S.keyword']");
    expect(source).toContain("doc['signedJudgeName.S.keyword']");
  });

  it('sorts by judge name descending when sortField is "TODAYS_ORDERS_SORTS.JUDGE_NAME_DESC"', () => {
    const result = getSortQuery(TODAYS_ORDERS_SORTS.JUDGE_NAME_DESC);
    expect(result).toEqual([
      {
        _script: {
          order: 'desc',
          script: {
            lang: 'painless',
            source: expect.stringContaining("eventCode == 'SPOS'"),
          },
          type: 'string',
        },
      },
    ]);
    const { source } = result[0]._script.script;
    expect(source).toContain("doc['judge.S.keyword']");
    expect(source).toContain("doc['signedJudgeName.S.keyword']");
  });

  it('sets sort to filingDate: desc by default', () => {
    expect(getSortQuery('TRASH')).toEqual([{ 'filingDate.S': 'desc' }]);
  });
});
