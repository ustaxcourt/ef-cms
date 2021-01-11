const AWS = require('aws-sdk');
const { get, pick } = require('lodash');
const { getClient } = require('../elasticsearch/client');

// const mappings = require('../elasticsearch/elasticsearch-mappings');
// const migratedCase = require('./migratedCase.json');
// const { settings } = require('../elasticsearch/elasticsearch-settings');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });

  const searchString = 'knight stephanie';
  const otherQuery2 = {
    body: {
      _source: [
        'caseCaption',
        'contactPrimary',
        'contactSecondary',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
        'irsPractitioners',
        'partyType',
        'receivedAt',
        'sealedDate',
      ],
      min_score: 0.5, //
      query: {
        bool: {
          must: [
            {
              match: {
                'entityName.S': 'Case',
              },
            },
          ],
          must_not: {
            exists: {
              field: 'sealedDate',
            },
          },
          should: [
            {
              simple_query_string: {
                boost: 5,
                default_operator: 'and',
                fields: [
                  'contactPrimary.M.name.S^3',
                  'contactPrimary.M.secondaryName.S^2',
                  'contactSecondary.M.name.S^1',
                  'caseCaption.S',
                ],
                flags: 'AND|PHRASE|PREFIX',
                query: `"${searchString}"`, // perfect, exact phrase match
              },
            },
            {
              simple_query_string: {
                boost: 1,
                default_operator: 'and',
                fields: [
                  'contactPrimary.M.name.S^3',
                  'contactPrimary.M.secondaryName.S^2',
                  'contactSecondary.M.name.S^1',
                  'caseCaption.S',
                ],
                flags: 'AND|PHRASE|PREFIX',
                query: searchString, // must match all terms in any order
              },
              // OR...
              // {
              //   query_string: {
              //     fields: [
              //       'contactPrimary.M.name.S^3',
              //       'contactPrimary.M.secondaryName.S^2',
              //       'contactSecondary.M.name.S^1',
              //       'caseCaption.S',
              //     ],
              //     query: "*word* *word2* *word3*",
              //   },
            },
          ],
        },
      },
      size: 10,
    },
    index: 'efcms-case',
  };

  let results = await esClient.search(otherQuery2);

  const hits = get(results, 'hits.hits');
  const formatHit = hit => {
    return {
      ...AWS.DynamoDB.Converter.unmarshall(hit['_source']),
      score: hit['_score'],
    };
  };

  if (hits && hits.length > 0) {
    results = hits
      .map(formatHit)
      .map(hit =>
        pick(hit, [
          'score',
          'caseCaption',
          'docketNumberWithSuffix',
          'contactPrimary.name',
          'contactPrimary.secondaryName',
          'contactSecondary.name',
        ]),
      );
  }
  console.log(JSON.stringify(results, null, 2));
})();

/*

* Exact matches = exact words in the exact order
			   OR = exact word in any order

* If there are no exact matches, inform the user
* If there are no exact matches, user can perform a partial match search
* Partial match = any words in any order

*/
