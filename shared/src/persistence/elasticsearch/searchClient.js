const AWS = require('aws-sdk');
const {
  formatDocketEntryResult,
} = require('./helpers/formatDocketEntryResult');
const { formatMessageResult } = require('./helpers/formatMessageResult');
const { get } = require('lodash');

exports.search = async ({ applicationContext, searchParameters }) => {
  let body;
  try {
    body = await applicationContext.getSearchClient().search(searchParameters);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

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

    if (isDocketEntryResultWithParentCaseMapping) {
      return formatDocketEntryResult({ caseMap, hit, sourceUnmarshalled });
    } else if (isMessageResultWithParentCaseMapping) {
      return formatMessageResult({ caseMap, hit, sourceUnmarshalled });
    } else {
      return sourceUnmarshalled;
    }
  });

  return {
    results,
    total,
  };
};
