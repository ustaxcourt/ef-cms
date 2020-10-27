const AWS = require('aws-sdk');
const { get } = require('lodash');

exports.search = async ({ applicationContext, searchParameters }) => {
  const caseMap = {};
  const results = [];

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const hits = get(body, 'hits.hits');
  const total = get(body, 'hits.total.value');

  const formatHit = hit => {
    const sourceUnmarshalled = AWS.DynamoDB.Converter.unmarshall(
      hit['_source'],
    );

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
        return {
          ...sourceUnmarshalled,
          ...AWS.DynamoDB.Converter.unmarshall(foundCase),
        };
      } else {
        return sourceUnmarshalled;
      }
    } else {
      return sourceUnmarshalled;
    }
  };

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      results.push(formatHit(hit));
    });
  }

  return {
    results,
    total,
  };
};
