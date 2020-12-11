const AWS = require('aws-sdk');
const { get, pick } = require('lodash');
const { EnvironmentCredentials } = AWS;
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {
  ELASTICSEARCH_API_VERSION,
} = require('../elasticsearch/elasticsearch-settings');
// const mappings = require('../elasticsearch/elasticsearch-mappings');
// const migratedCase = require('./migratedCase.json');
// const { settings } = require('../elasticsearch/elasticsearch-settings');

const esClient = new elasticsearch.Client({
  amazonES: {
    credentials: new EnvironmentCredentials('AWS'),
    region: 'us-east-1',
  },
  apiVersion: ELASTICSEARCH_API_VERSION,
  awsConfig: new AWS.Config({ region: 'us-east-1' }),
  connectionClass: connectionClass,
  host:
    'https://search-efcms-search-prod-alpha-uxekmvwjhblksyin6ndohlaazq.us-east-1.es.amazonaws.com/',
  log: 'warning',
  port: 443,
  protocol: 'https',
});

(async () => {
  const orderQuery = {
    body: {
      _source: [
        'caseCaption',
        'contactPrimary',
        'contactSecondary',
        'docketEntryId',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
        'documentContents',
        'documentTitle',
        'documentType',
        'eventCode',
        'filingDate',
        'irsPractitioners',
        'isSealed',
        'numberOfPages',
        'privatePractitioners',
        'sealedDate',
        'signedJudgeName',
      ],
      query: {
        bool: {
          must: [
            {
              match: {
                'pk.S': 'case|',
              },
            },
            {
              match: {
                'sk.S': 'docket-entry|',
              },
            },
            {
              exists: {
                field: 'servedAt',
              },
            },
            {
              bool: {
                must_not: [
                  {
                    term: {
                      'isStricken.BOOL': true,
                    },
                  },
                ],
                should: [
                  {
                    match: {
                      'eventCode.S': 'O',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAJ',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'SPOS',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'SPTO',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAL',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAPF',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAR',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAS',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OASL',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAW',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OCA',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OD',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODD',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODR',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODS',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODSL',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODW',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OF',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OFAB',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OFFX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OFWD',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OFX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OIP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OJR',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OODS',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OPFX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OPX',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ORAP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OROP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OSC',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OSCP',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OST',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OSUB',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'OAD',
                    },
                  },
                  {
                    match: {
                      'eventCode.S': 'ODJ',
                    },
                  },
                ],
              },
            },
            {
              simple_query_string: {
                fields: ['documentContents.S', 'documentTitle.S'],
                query: 'order',
              },
            },
            {
              has_parent: {
                inner_hits: {
                  _source: {
                    includes: [
                      'caseCaption',
                      'contactPrimary',
                      'contactSecondary',
                      'docketEntryId',
                      'docketNumber',
                      'docketNumberSuffix',
                      'docketNumberWithSuffix',
                      'documentContents',
                      'documentTitle',
                      'documentType',
                      'eventCode',
                      'filingDate',
                      'irsPractitioners',
                      'isSealed',
                      'numberOfPages',
                      'privatePractitioners',
                      'sealedDate',
                      'signedJudgeName',
                    ],
                  },
                  name: 'case-mappings',
                },
                parent_type: 'case',
                query: {
                  bool: {
                    must: {
                      simple_query_string: {
                        fields: [
                          'caseCaption.S',
                          'contactPrimary.M.name.S',
                          'contactSecondary.M.name.S',
                        ],
                        // user input: robert zimmerman
                        query: '("robert zimmerman") | (robert + zimmerman)',
                      },
                    },
                    must_not: [
                      {
                        term: {
                          'isSealed.BOOL': true,
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      size: 10,
    },
    index: 'efcms-docket-entry',
  };
  let results = await esClient.search(orderQuery);

  const hits = get(results, 'hits.hits');
  const caseMap = {};

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
    results = hits.map(formatHit).map(hit => pick(hit, ['caseCaption']));
  }

  console.log(JSON.stringify(results, null, 2));
})();
