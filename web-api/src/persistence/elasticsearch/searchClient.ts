import { formatDocketEntryResult } from './helpers/formatDocketEntryResult';
import { get } from 'lodash';
import { getIndexNameFromAlias } from '../../../elasticsearch/elasticsearch-aliases';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { updateIndex } from '@web-api/persistence/elasticsearch/helpers/getIndexName';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import {
  Count_Request,
  Search_Request,
} from '@opensearch-project/opensearch/api';
import {
  type Common,
  type Core_Search,
} from '@opensearch-project/opensearch/api/_types';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';

const CHUNK_SIZE = MAX_ELASTICSEARCH_PAGINATION;
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

export type SearchClientCountResultsType = number;

export const formatResults = <T>(body: Record<string, any>) => {
  const total: number = get(body, 'hits.total.value', 0);
  const aggregations = get(body, 'aggregations');

  const caseMap = {};
  const results: T[] = get(body, 'hits.hits', []).map(hit => {
    delete hit['_source']['case_relations'];
    const sourceUnmarshalled = unmarshall(hit['_source']);
    sourceUnmarshalled['_score'] = hit['_score'];
    sourceUnmarshalled['sort'] = hit['sort'];

    const isDocketEntryResultWithParentCaseMapping =
      hit['_index'] === getIndexNameFromAlias('efcms-docket-entry') &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];

    if (isDocketEntryResultWithParentCaseMapping) {
      return formatDocketEntryResult({ caseMap, hit, sourceUnmarshalled });
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
  applicationContext: ServerApplicationContext;
  searchParameters: Count_Request;
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
  applicationContext: ServerApplicationContext;
  searchParameters: Search_Request;
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

export const searchRaw = async ({
  applicationContext,
  searchParameters,
}: {
  applicationContext: ServerApplicationContext;
  searchParameters: Search_Request;
}): Promise<any> => {
  updateIndex({ searchParameters });
  try {
    return await applicationContext.getSearchClient().search(searchParameters);
  } catch (searchError) {
    applicationContext.logger.error('OpenSearch error', searchError);
    throw new Error('Search client encountered an error.');
  }
};

export const searchAll = async ({
  applicationContext,
  searchParameters,
}: {
  applicationContext: ServerApplicationContext;
  searchParameters: Search_Request;
}): Promise<SearchClientResultsType> => {
  updateIndex({ searchParameters });
  const index = searchParameters.index || '';
  const query = searchParameters.body?.query || {};
  const size = searchParameters.size || CHUNK_SIZE;

  const expected = await count({
    applicationContext,
    searchParameters: {
      body: {
        query,
      },
      index,
    },
  });

  const _source: Core_Search.SourceConfigParam =
    (searchParameters.body?._source as Core_Search.SourceConfigParam) || [];
  let search_after: Common.SortResults = [0];
  const sort = searchParameters.body?.sort || [{ 'pk.S': 'asc' }]; // sort is required for paginated queries

  let i = 0;
  let results = [];
  while (i < expected) {
    const chunk = await searchRaw({
      applicationContext,
      searchParameters: {
        _source,
        body: {
          query,
          search_after,
          sort,
        },
        index,
        size,
      },
    });
    const hits = get(chunk, 'body.hits.hits', []);

    if (hits.length > 0) {
      results = results.concat(hits);
      search_after = hits[hits.length - 1].sort;
    }
    // i += hits.length;
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
