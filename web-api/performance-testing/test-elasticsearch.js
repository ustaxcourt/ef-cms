const AWS = require('aws-sdk');
const { get, pick } = require('lodash');
const { EnvironmentCredentials } = AWS;
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {
  ELASTICSEARCH_API_VERSION,
} = require('../elasticsearch/elasticsearch-settings');

const esClient = new elasticsearch.Client({
  amazonES: {
    credentials: new EnvironmentCredentials('AWS'),
    region: 'us-east-1',
  },
  apiVersion: ELASTICSEARCH_API_VERSION,
  awsConfig: new AWS.Config({ region: 'us-east-1' }),
  connectionClass: connectionClass,
  host:
    'https://search-efcms-search-prod-beta-a7ipygzclmf7xol2u7udchjjie.us-east-1.es.amazonaws.com/',
  log: 'warning',
  port: 443,
  protocol: 'https',
});

(async () => {
  const otherQuery = {
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
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                default_operator: 'and',
                fields: [
                  'contactPrimary.M.name.S',
                  'contactPrimary.M.secondaryName.S',
                  'contactSecondary.M.name.S',
                ],
                flags: 'AND|PHRASE|PREFIX',
                query: 'knight stephanie bilbo',
              },
            },
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
        },
      },
      size: 5,
    },
    index: 'efcms-case',
  };
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
  const orderQuery = {
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
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                default_operator: 'and',
                fields: [
                  'contactPrimary.M.name.S',
                  'contactPrimary.M.secondaryName.S',
                  'contactSecondary.M.name.S',
                ],
                flags: 'AND|PHRASE|PREFIX',
                query: 'stephanie murrin',
              },
            },
            {
              match: {
                'pk.S': 'case}',
              },
            },
            {
              match: {
                'sk.S': 'case}',
              },
            },
          ],
          must_not: {
            exists: {
              field: 'sealedDate',
            },
          },
        },
      },
      size: 20,
    },
    index: 'efcms-case',
  };
  const murrinquery = {
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
      query: {
        bool: {
          must: [
            {
              query_string: {
                fields: [
                  'contactPrimary.M.name.S',
                  'contactPrimary.M.secondaryName.S',
                  'contactSecondary.M.name.S',
                  'caseCaption.S',
                ],
                query: '*stephanie murrin*',
              },
            },
            {
              match: {
                'pk.S': 'case|',
              },
            },
            {
              match: {
                'sk.S': 'case|',
              },
            },
          ],
          must_not: {
            exists: {
              field: 'sealedDate',
            },
          },
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
