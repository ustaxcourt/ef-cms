import { Search } from '@opensearch-project/opensearch/api/requestParams';
import { formatDocketEntryResult } from './helpers/formatDocketEntryResult';
import { formatMessageResult } from './helpers/formatMessageResult';
import { formatWorkItemResult } from './helpers/formatWorkItemResult';
import { get } from 'lodash';
import { getIndexNameFromAlias } from '../../../elasticsearch/elasticsearch-aliases';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { updateIndex } from '@web-api/persistence/elasticsearch/helpers/getIndexName';

const CHUNK_SIZE = 10000;
export type SearchClientResultsType = {
  aggregations?: {
    [x: string]: {
      buckets: {
        doc_count: number;
        key: string;
      }[];
    };
  };
  expected?: number;
  total: number;
  results: any;
};
export type SearchAllParametersType = {
  index?: string;
  body?: {
    _source?: string[];
    query?: any;
    sort?: any;
  };
  size?: number;
};

export type SearchClientCountResultsType = number;

export const formatResults = <T>(body: Record<string, any>) => {
  const total: number = get(body, 'hits.total.value', 0);
  const aggregations = get(body, 'aggregations');

  let caseMap = {};
  const results: T[] = get(body, 'hits.hits', []).map(hit => {
    const sourceUnmarshalled = unmarshall(hit['_source']);
    sourceUnmarshalled['_score'] = hit['_score'];

    const isDocketEntryResultWithParentCaseMapping =
      hit['_index'] === getIndexNameFromAlias('efcms-docket-entry') &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isMessageResultWithParentCaseMapping =
      hit['_index'] === getIndexNameFromAlias('efcms-message') &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isWorkItemResultWithParentCaseMapping =
      hit['_index'] === getIndexNameFromAlias('efcms-work-item') &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];

    if (isDocketEntryResultWithParentCaseMapping) {
      return formatDocketEntryResult({ caseMap, hit, sourceUnmarshalled });
    } else if (isMessageResultWithParentCaseMapping) {
      return formatMessageResult({ caseMap, hit, sourceUnmarshalled });
    } else if (isWorkItemResultWithParentCaseMapping) {
      return formatWorkItemResult({ caseMap, hit, sourceUnmarshalled });
    } else {
      return sourceUnmarshalled;
    }
  });

  return {
    aggregations,
    results,
    total,
  };
};

export const count = async ({
  applicationContext,
  searchParameters,
}: {
  applicationContext: IApplicationContext;
  searchParameters: Search;
}): Promise<SearchClientCountResultsType> => {
  updateIndex({ searchParameters });
  try {
    const response = await applicationContext
      .getSearchClient()
      .count(searchParameters);
    return get(response.body, 'count', 0);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }
};

export const search = async <T>({
  applicationContext,
  searchParameters,
}: {
  applicationContext: IApplicationContext;
  searchParameters: Search;
}): Promise<SearchClientResultsType> => {
  updateIndex({ searchParameters });
  try {
    const response = await applicationContext
      .getSearchClient()
      .search(searchParameters);
    return formatResults<T>(response.body);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }
};

export const searchAll = async ({
  applicationContext,
  searchParameters,
}: {
  applicationContext: IApplicationContext;
  searchParameters: SearchAllParametersType;
}): Promise<SearchClientResultsType> => {
  updateIndex({ searchParameters });
  const index = searchParameters.index || '';
  const query = searchParameters.body?.query || {};
  const size = searchParameters.size || CHUNK_SIZE;

  let countQ;
  try {
    countQ = await applicationContext.getSearchClient().count({
      body: {
        query,
      },
      index,
    });
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

  // eslint-disable-next-line no-underscore-dangle
  const _source = searchParameters.body?._source || [];
  let search_after = [0];
  const sort = searchParameters.body?.sort || [{ 'pk.S': 'asc' }]; // sort is required for paginated queries

  const expected = get(countQ, 'body.count', 0);

  let i = 0;
  let results = [];
  while (i < expected) {
    const chunk = await applicationContext.getSearchClient().search({
      _source,
      body: {
        query,
        search_after,
        sort,
      },
      index,
      size,
    });
    const hits = get(chunk, 'body.hits.hits', []);

    if (hits.length > 0) {
      results = results.concat(hits);
      search_after = hits[hits.length - 1].sort;
    }
    i += size; // this avoids an endless loop if expected is somehow greater than the sum of all hits
  }

  return {
    ...formatResults({
      hits: {
        hits: results,
        total: {
          value: results.length,
        },
      },
    }),
    expected,
  };
};
