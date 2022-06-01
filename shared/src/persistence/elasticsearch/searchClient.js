const AWS = require('aws-sdk');
const { get } = require('lodash');

exports.search = async ({ applicationContext, searchParameters }) => {
  const caseMap = {};
  const formatHit = hit => {
    const sourceUnmarshalled = AWS.DynamoDB.Converter.unmarshall(
      hit['_source'],
    );
    sourceUnmarshalled['_score'] = hit['_score'];

    if (
      hit['_index'] === 'efcms-docket-entry' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings']
    ) {
      const casePk = hit['_id'].split('_')[0];
      const docketNumber = casePk.replace('case|', ''); // TODO figure out why docket number isn't always on a DocketEntry

      let foundCase = caseMap[docketNumber];

      if (!foundCase) {
        hit.inner_hits['case-mappings'].hits.hits.some(innerHit => {
          const innerHitDocketNumber = innerHit['_source'].docketNumber.S;
          caseMap[innerHitDocketNumber] = innerHit['_source'];

          if (innerHitDocketNumber === docketNumber) {
            foundCase = innerHit['_source'];
            return true;
          }
        });
      }

      if (foundCase) {
        const foundCaseUnmarshalled =
          AWS.DynamoDB.Converter.unmarshall(foundCase);
        return {
          isCaseSealed: !!foundCaseUnmarshalled.isSealed,
          isDocketEntrySealed: !!sourceUnmarshalled.isSealed,
          ...foundCaseUnmarshalled,
          ...sourceUnmarshalled,
          isSealed: undefined,
        };
      } else {
        return sourceUnmarshalled;
      }
    } else if (
      hit['_index'] === 'efcms-message' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings']
    ) {
      const casePk = hit['_id'].split('_')[0];
      const docketNumber = casePk.replace('case|', ''); // TODO figure out why docket number isn't always on a DocketEntry

      let foundCase = caseMap[docketNumber];

      if (!foundCase) {
        hit.inner_hits['case-mappings'].hits.hits.some(innerHit => {
          const innerHitDocketNumber = innerHit['_source'].docketNumber.S;
          caseMap[innerHitDocketNumber] = innerHit['_source'];

          if (innerHitDocketNumber === docketNumber) {
            foundCase = innerHit['_source'];
            return true;
          }
        });
      }

      if (foundCase) {
        const foundCaseUnmarshalled =
          AWS.DynamoDB.Converter.unmarshall(foundCase);

        return {
          leadDocketNumber: foundCaseUnmarshalled.leadDocketNumber,
          ...foundCaseUnmarshalled,
          ...sourceUnmarshalled,
        };
      } else {
        return sourceUnmarshalled;
      }
    } else {
      return sourceUnmarshalled;
    }
  };

  let body;
  try {
    body = await applicationContext.getSearchClient().search(searchParameters);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

  const total = get(body, 'hits.total.value', 0);

  const results = get(body, 'hits.hits', []).map(formatHit);

  return {
    results,
    total,
  };
};
