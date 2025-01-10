#!/usr/bin/env -S npx ts-node --transpile-only

import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description:
    'lookup-user - Looks up users and roles in a deployed DAWSON environment.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  parameters: {
    role: {
      position: 0,
      required: true,
      type: 'string',
    },
    userName: {
      position: 1,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { role, userName } = parseArgsAndEnvVars(scriptConfig) as {
  role: string;
  userName: string;
};

if (!role.length && !userName.length) {
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

const lookupUsers = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<{ [k: string]: string }[]> => {
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

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: { query },
      index: 'efcms-user',
    },
  });

  return results.map((hit: RawUser) => ({
    Email: hit.email,
    Name: hit.name,
    Role: hit.role,
    UserId: hit.userId,
  }));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const users = await lookupUsers({ applicationContext });
  console.table(users);
})();
