const { get } = require('lodash');
const { getClient } = require('./client');

const CHUNK_SIZE = 5000;

/**
 * Uses Elasticsearch's `search_after` to return all results for the provided query
 *
 * @param {Object} clientArgs object containing the keys 'environmentName' and 'version'
 * @param {String} index Elasticsearch index
 * @param {Object} query Elasticsearch query
 * @param {Array<Object>} sort array of objects describing the fields and direction to sort by
 * @param {Array<String>} source array of fields to return
 * @returns {Promise<Array<Object>>} results
 */
const searchAll = async (clientArgs, index, query, sort, source) => {
  sort = sort || [{ 'pk.S': 'asc' }];
  source = source || [];

  const client = await getClient(clientArgs);

  const countQ = await client.count({
    body: {
      query,
    },
    index,
  });
  const total = 'count' in countQ ? countQ.count : 0;

  let i = 0;
  let searchAfter = [0];
  let results = [];
  while (i < total) {
    const chunk = await client.search({
      _source: source,
      body: {
        query,
        search_after: searchAfter,
        sort,
      },
      index,
      size: CHUNK_SIZE,
    });
    const hits = get(chunk, 'hits.hits');

    if (hits && hits.length > 0) {
      results = results.concat(hits);
      searchAfter = hits[hits.length - 1].sort;
    }
    i += CHUNK_SIZE;
  }

  return results;
};

module.exports = { searchAll };
