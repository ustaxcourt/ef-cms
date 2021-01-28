/**
 * This script is to help search for users belonging to a certain role in the
 * environment designated by the ENV environment variable
 *
 * You must have the following Environment variables set:
 * - ENV: The name of the environment you are working with (mig)
 *
 * Example usage:
 *
 * $ npm run admin:lookup-user docketClerk "Beth"
 */

const { checkEnvVar } = require('../util');
const { getClient } = require('../../../web-api/elasticsearch/client');

const { ENV } = process.env;

checkEnvVar(ENV, 'You must have ENV set in your environment');

if (process.argv.length < 3) {
  console.log(`Lookup User IDs and roles for the specified environment.
  
  Usage:

  $ npm run admin:lookup-user -- <ROLE> [<NAME>]
  
  - ROLE: The role to find
  - NAME: The name of the user you're looking for (optional)

  Example:

  $ npm run admin:lookup-user -- admissionsClerk "Joe Burns"

`);
  process.exit();
}

const role = process.argv[2];
const userName = process.argv[3];

const lookupUsers = async () => {
  const esClient = await getClient({ environmentName: ENV });
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

  try {
    const results = await esClient.search({
      body: { query },
      index: 'efcms-user',
    });
    return results.hits.hits.map(hit => {
      return {
        Email: hit['_source']['email'].S,
        Name: hit['_source']['name'].S,
        Role: hit['_source']['role'].S,
        UserId: hit['_source']['userId'].S,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  const users = await lookupUsers();
  console.table(users);
})();
