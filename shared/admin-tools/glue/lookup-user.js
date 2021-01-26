/**
 * This script is to grant the user running it the ability to search for a UserId
 * in the system.
 */

const { getClient } = require('../../../web-api/elasticsearch/client');

if (process.argv.length < 4) {
  console.log(`Lookup User IDs and roles for the specified environment.
  
  Usage:

  $ npm run admin:lookup-user -- <ENV> <ROLE> [<NAME>]
  
  - ENV: The environment to search (e.g., mig)
  - ROLE: The role to find

  Example:

  $ npm run admin:lookup-user -- mig admissionsClerk "Joe Burns"

`);
  process.exit();
}

const environmentName = process.argv[2];
const role = process.argv[3];
const userName = process.argv[4];

(async () => {
  const esClient = await getClient({ environmentName });
  const query = userName
    ? {
        bool: {
          must: [
            { match: { 'role.S': role } },
            { match: { 'name.S': userName } },
          ],
        },
      }
    : {
        match: { 'role.S': role },
      };

  const results = await esClient.search({
    body: { query },
    index: 'efcms-user',
  });

  const users = results.hits.hits.map(hit => {
    return {
      Email: hit['_source']['email'].S,
      Name: hit['_source']['name'].S,
      UserId: hit['_source']['userId'].S,
    };
  });

  console.table(users);
})();
