import {
  DOCUMENT_SEARCH_SORT,
  TODAYS_ORDERS_SORTS,
} from '../../../../../shared/src/business/entities/EntityConstants';

const DOCKET_NUMBER_SORT_SCRIPT = [
  "if (doc['docketNumber.S'].size() == 0) { return 0L; }",
  "def dn = doc['docketNumber.S'].value;",
  "def idx = dn.indexOf('-');",
  'if (idx < 0) { return 0L; }',
  'def seq = dn.substring(0, idx);',
  'def rest = dn.substring(idx + 1);',
  'def yearPart = rest.length() >= 2 ? rest.substring(0, 2) : rest;',
  'def year = Integer.parseInt(yearPart);',
  'long yearFull = year >= 65 ? 1900L + year : 2000L + year;',
  'long seqNum = Long.parseLong(seq);',
  'return yearFull * 1000000L + seqNum;',
].join(' ');

const JUDGE_NAME_SORT_SCRIPT = [
  "def eventCode = doc['eventCode.S'].size() > 0 ? doc['eventCode.S'].value : '';",
  "if (eventCode == 'SPOS' || eventCode == 'SPTO') {",
  "  return doc['judge.S.keyword'].size() > 0 ? doc['judge.S.keyword'].value.toLowerCase() : '';",
  '} else {',
  "  return doc['signedJudgeName.S.keyword'].size() > 0 ? doc['signedJudgeName.S.keyword'].value.toLowerCase() : '';",
  '}',
].join(' ');

export const getSortQuery = sortField => {
  let sort;
  let sortOrder = 'desc';

  if (
    [
      DOCUMENT_SEARCH_SORT.DOCKET_NUMBER_ASC,
      DOCUMENT_SEARCH_SORT.DOCUMENT_TITLE_ASC,
      DOCUMENT_SEARCH_SORT.FILING_DATE_ASC,
      DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC,
      TODAYS_ORDERS_SORTS.CASE_CAPTION_ASC,
      TODAYS_ORDERS_SORTS.JUDGE_NAME_ASC,
    ].includes(sortField)
  ) {
    sortOrder = 'asc';
  }

  switch (sortField) {
    case DOCUMENT_SEARCH_SORT.DOCKET_NUMBER_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.DOCKET_NUMBER_DESC:
      sort = [
        {
          _script: {
            order: sortOrder,
            script: {
              lang: 'painless',
              source: DOCKET_NUMBER_SORT_SCRIPT,
            },
            type: 'number',
          },
        },
      ];
      break;
    case DOCUMENT_SEARCH_SORT.DOCUMENT_TITLE_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.DOCUMENT_TITLE_DESC:
      sort = [
        {
          _script: {
            order: sortOrder,
            script: {
              lang: 'painless',
              source:
                "doc['documentTitle.S.keyword'].size() > 0 ? doc['documentTitle.S.keyword'].value.toLowerCase() : ''",
            },
            type: 'string',
          },
        },
      ];
      break;
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.NUMBER_OF_PAGES_DESC:
      sort = [{ 'numberOfPages.N': sortOrder }];
      break;
    case TODAYS_ORDERS_SORTS.CASE_CAPTION_ASC: // fall through
    case TODAYS_ORDERS_SORTS.CASE_CAPTION_DESC:
      sort = [
        {
          _script: {
            order: sortOrder,
            script: {
              lang: 'painless',
              source:
                "doc['caseCaption.S.keyword'].size() > 0 ? doc['caseCaption.S.keyword'].value.toLowerCase() : ''",
            },
            type: 'string',
          },
        },
      ];
      break;
    case TODAYS_ORDERS_SORTS.JUDGE_NAME_ASC: // fall through
    case TODAYS_ORDERS_SORTS.JUDGE_NAME_DESC:
      sort = [
        {
          _script: {
            order: sortOrder,
            script: {
              lang: 'painless',
              source: JUDGE_NAME_SORT_SCRIPT,
            },
            type: 'string',
          },
        },
      ];
      break;
    case DOCUMENT_SEARCH_SORT.FILING_DATE_ASC: // fall through
    case DOCUMENT_SEARCH_SORT.FILING_DATE_DESC: // fall through
    default:
      sort = [{ 'filingDate.S': sortOrder }];
      break;
  }

  return sort;
};
