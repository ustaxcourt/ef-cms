const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  MAX_SEARCH_CLIENT_RESULTS,
} = require('../../src/business/entities/EntityConstants');
const { search } = require('../../src/persistence/elasticsearch/searchClient');

const getJudgeUsers = async ({ applicationContext }) => {
  const results = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'role.S': {
                  value: 'judge',
                },
              },
            },
          },
        },
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-user',
    },
  });
  let judgeUsers = {};
  for (const judge of results) {
    const emailDomain = judge.email.split('@')[1];
    if (emailDomain in ['example.com', 'ef-cms.ustaxcourt.gov']) {
      if (!(judge.name in judgeUsers)) {
        judgeUsers[judge.name] = {};
      }
      judgeUsers[judge.name][emailDomain] = judge.pk.replace('user|', '');
    }
  }
};

(async () => {
  const applicationContext = createApplicationContext({});

  // pull all judge users from ES
  const judgeUsers = await getJudgeUsers({ applicationContext });
  console.log(judgeUsers);

  /*for (const judge in judgeUsers) {
    if ('example.com' in judge && 'ef-cms.ustaxcourt.gov' in judge) {
      // delete the @example.com User and UserCase entities
      // change the @example.com user's cognito custom:userId attribute to the @ef-cms.ustaxcourt.gov id
    }
  }*/
})();
