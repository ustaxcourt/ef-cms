const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const howManyPetitioners = async () => {
  const esClient = await getClient({ environmentName, version });
  const query = {
    term: {
      'role.S': 'petitioner',
    },
  };
  const response = await esClient.count({
    body: { query },
    index: 'efcms-user',
  });
  console.log(response);
};

(async () => {
  await howManyPetitioners();
})();
