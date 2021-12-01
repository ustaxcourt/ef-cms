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
        hit.inner_hits['case-mappings'].hits.hits.some(associatedCase => {
          const associatedDocketEntry = hit;
          const caseDocketNumber = associatedCase['_source'].docketNumber.S;

          const isCaseOrDocketEntrySealed =
            !!associatedCase['_source'].isSealed?.BOOL ||
            !!associatedDocketEntry['_source'].isSealed?.BOOL;

          associatedCase['_source'] = {
            ...associatedCase['_source'],
            isSealed: { BOOL: isCaseOrDocketEntrySealed },
          };
          caseMap[caseDocketNumber] = associatedCase['_source'];

          if (caseDocketNumber === docketNumber) {
            foundCase = associatedCase['_source'];
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
