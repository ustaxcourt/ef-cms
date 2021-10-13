const { getClient } = require('../../../web-api/elasticsearch/client');
const { getVersion } = require('..//util');

const environmentName = process.argv[2] || 'exp1';
const userId = process.argv[3];

(async () => {
  const version = await getVersion();
  const esClient = await getClient({ environmentName, version });

  // verify in efcms-user records are not present for given irsPractitioner userId
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'role.S': 'irsPractitioner',
              },
            },
            {
              match_phrase_prefix: {
                'pk.S': 'user|',
              },
            },
            // {
            //   match: {
            //     'sk.S': `case|`,
            //   },
            // },
            //   {
            //     "query": {
            //         "match_phrase_prefix": {
            //             "title": {
            //                 "query": "a"
            //             }
            //         }
            //     }
            // }
          ],
        },
      },
    },
    index: 'efcms-user',
  };

  const results = await esClient.search(query);

  // console.log(results.hits.hits);
  results.hits.hits.forEach(hit => {
    console.log(hit['_source']);
  });
})();
