import { DocketEntryMapping } from '../../../elasticsearch/index-types';
import { MAX_SEARCH_CLIENT_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { flatMap } from 'lodash';
import { getDbReader } from '@web-api/database';
import { getSealedQuery } from './advancedDocumentSearchHelpers/getSealedQuery';
import { getSortQuery } from './advancedDocumentSearchHelpers/getSortQuery';
import { search } from './searchClient';
import { sql } from 'kysely';

const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

export const advancedDocumentSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  documentEventCodes,
  endDate,
  from = 0,
  isExternalUser,
  isOpinionSearch = false,
  judge,
  keyword,
  omitSealed,
  overrideResultSize,
  sortField,
  startDate,
}: {
  applicationContext: IApplicationContext;
  caseTitleOrPetitioner?: string;
  docketNumber?: string;
  documentEventCodes: string[];
  endDate?: string;
  from?: number;
  isExternalUser?: boolean;
  isOpinionSearch?: boolean;
  judge?: string;
  keyword?: string;
  omitSealed?: boolean;
  overrideResultSize?: number;
  sortField?: string;
  startDate?: string;
}) => {
  const sourceFields = [
    'caseCaption',
    'docketEntryId',
    'docketNumber',
    'docketNumberWithSuffix',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'isFileAttached',
    'isSealed',
    'isStricken',
    'judge',
    'numberOfPages',
    'sealedTo',
    'signedJudgeName',
  ];

  const documentMust: QueryDslQueryContainer[] = [];

  if (keyword) {
    documentMust.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['documentContents.S', 'documentTitle.S'],
        flags: simpleQueryFlags,
        query: keyword,
      },
    });
  }

  let documentMustNot: QueryDslQueryContainer[] = [
    { term: { 'isStricken.BOOL': true } },
  ];
  if (omitSealed) {
    const { sealedDocumentMustNotQuery } = getSealedQuery();

    documentMustNot = [...documentMustNot, ...sealedDocumentMustNotQuery];
  } else {
    if (isExternalUser) {
      documentMustNot.push({
        term: { 'sealedTo.S': 'External' },
      });
    }
  }

  if (!caseTitleOrPetitioner && docketNumber) {
    documentMust.push({
      term: { 'docketNumber.S': docketNumber },
    });
  }

  if (isOpinionSearch) {
    documentMustNot = [
      ...documentMustNot,
      {
        term: { 'isSealed.BOOL': true },
      },
    ];
  }

  const documentFilter: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    { term: { 'isFileAttached.BOOL': true } },
    { terms: { 'eventCode.S': documentEventCodes } },
  ];

  if (endDate && startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
          lte: `${endDate}||/h`,
        },
      },
    });
  } else if (startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${startDate}||/h`,
        },
      },
    });
  }

  const documentQuery = {
    body: {
      _source: sourceFields,
      from,
      query: {
        bool: {
          filter: documentFilter,
          must: documentMust,
          must_not: documentMustNot,
        },
      },
      size: overrideResultSize || MAX_SEARCH_CLIENT_RESULTS,
      sort: getSortQuery(sortField),
    },
    index: 'efcms-docket-entry',
  };

  const { results: opensearchResults } = await search<DocketEntryMapping>({
    applicationContext,
    searchParameters: documentQuery,
  });

  const judgeName = judge?.replace(/Chief\s|Legacy\s|Judge\s/g, '');

  const postgresResults = await getDbReader(reader => {
    let query = reader
      // Get all cases, aggregating petitioner names and case caption data
      .with('docketEntries', db => {
        let subQuery = db
          .selectFrom('dwDocketEntry as d')
          .leftJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
          .leftJoin(
            'dwPetitionerOnCase as p',
            'd.docketNumber',
            'p.docketNumber',
          )
          .where('d.isStricken', 'is not', true);

        if (docketNumber) {
          subQuery = subQuery.where('c.docketNumber', '=', docketNumber);
        }

        if (isOpinionSearch) {
          subQuery = subQuery.where('d.isSealed', 'is not', true);
        }

        if (judgeName) {
          subQuery = subQuery.where(eb =>
            eb.or([
              eb('d.judge', 'like', `%${judgeName}%`),
              eb('d.signedJudgeName', 'like', `%${judgeName}%`),
            ]),
          );
        }

        if (startDate) {
          subQuery = subQuery.where(
            'd.filingDate',
            '>=',
            calculateDate({ dateString: startDate }),
          );
        }

        if (endDate) {
          subQuery = subQuery.where(
            'd.filingDate',
            '<=',
            calculateDate({ dateString: endDate }),
          );
        }

        if (omitSealed) {
          subQuery = subQuery
            .where('c.isSealed', 'is not', true)
            .where('d.isSealed', 'is not', true)
            .where(eb =>
              eb.or([
                eb('d.sealedTo', 'is', null),
                eb('d.sealedTo', '!=', 'External'),
              ]),
            );
        } else {
          if (isExternalUser) {
            subQuery = subQuery.where(eb =>
              eb.or([
                eb('d.sealedTo', 'is', null),
                eb('d.sealedTo', '!=', 'External'),
              ]),
            );
          }
        }

        subQuery = subQuery.select([
          'd.docketEntryId',
          'd.docketNumber',
          'd.filingDate',
          'd.sealedTo',
          'd.numberOfPages',
          'c.docketNumberSuffix',
          'd.isSealed as docketEntrySealed',
          'c.isSealed as caseSealed',
          'c.sealedDate',
          'c.associatedJudge',
          'c.caption',
        ]);

        if (caseTitleOrPetitioner) {
          subQuery = subQuery
            .select([
              sql<string>`string_agg("p".name, ', ') || ' '`.as('nameToMatch'),
            ])
            .groupBy([
              'd.docketEntryId',
              'd.docketNumber',
              'd.filingDate',
              'd.sealedTo',
              'd.numberOfPages',
              'd.isSealed',
              'c.isSealed',
              'c.docketNumberSuffix',
              'c.sealedDate',
              'c.associatedJudge',
              'c.caption',
            ]);
        }
        subQuery = subQuery.orderBy('d.filingDate', 'desc');

        return subQuery;
      });

    const query2 = query
      .with('docketEntryWithScores', db =>
        db
          .selectFrom('docketEntries')
          .selectAll()
          .select(
            sql`word_similarity(${caseTitleOrPetitioner}, COALESCE(name_to_match, '')) + word_similarity(${caseTitleOrPetitioner}, COALESCE(caption, ''))`.as(
              'total_rank',
            ),
          ),
      )
      .selectFrom('docketEntryWithScores')
      .where('total_rank', '>=', 0.5);

    if (!docketNumber && caseTitleOrPetitioner) {
      return query2.selectAll().execute();
    }

    return query.selectFrom('docketEntries').selectAll().execute();
  });

  console.log('postgresResults', postgresResults);
  console.log('opensearchResults', opensearchResults);

  const combinedSearchResults = flatMap<any, any>(postgresResults, pgRecord => {
    return opensearchResults
      .filter(
        osRecord =>
          osRecord.docketNumber === pgRecord.docketNumber &&
          osRecord.docketEntryId === pgRecord.docketEntryId,
      )
      .map(osRecord => ({
        ...{
          ...pgRecord,
          caseCaption: pgRecord.caption,
          docketNumberWithSuffix:
            pgRecord.docketNumber + (pgRecord.docketNumberSuffix || ''),
          isCaseSealed: pgRecord.caseSealed || false,
          isDocketEntrySealed: pgRecord.docketEntrySealed || false,
          judge: pgRecord.associatedJudge,
          sealedDate: pgRecord.sealedDate?.toISOString(),
        },
        ...osRecord,
      }));
  });

  console.log('openSearch results', opensearchResults);

  console.log(
    'combinedSearchResults',
    combinedSearchResults,
    combinedSearchResults.length,
  );

  return {
    results: combinedSearchResults,
    totalCount: combinedSearchResults.length,
  };
};
