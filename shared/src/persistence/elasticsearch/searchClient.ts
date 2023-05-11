import { formatDocketEntryResult } from './helpers/formatDocketEntryResult';
import { formatMessageResult } from './helpers/formatMessageResult';
import { formatWorkItemResult } from './helpers/formatWorkItemResult';
import { get } from 'lodash';
import AWS from 'aws-sdk';

const CHUNK_SIZE = 10000;

export const formatResults = body => {
  const total = get(body, 'hits.total.value', 0);

  let caseMap = {};
  const results = get(body, 'hits.hits', []).map(hit => {
    const sourceUnmarshalled = AWS.DynamoDB.Converter.unmarshall(
      hit['_source'],
    );
    sourceUnmarshalled['_score'] = hit['_score'];

    const isDocketEntryResultWithParentCaseMapping =
      hit['_index'] === 'efcms-docket-entry' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isMessageResultWithParentCaseMapping =
      hit['_index'] === 'efcms-message' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isWorkItemResultWithParentCaseMapping =
      hit['_index'] === 'efcms-work-item' &&
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
    results,
    total,
  };
};

export const search = async ({ applicationContext, searchParameters }) => {
  let body;
  try {
    ({ body } = await applicationContext
      .getSearchClient()
      .search(searchParameters));
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }
  return formatResults(body);
};

export const searchAll = async ({ applicationContext, searchParameters }) => {
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
