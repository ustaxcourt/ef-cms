#!/usr/bin/env -S npx ts-node --transpile-only

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
    "practitioners-email-in-cases - Lists the email address defined in each of a practitioner's cases",
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  parameters: {
    practitionerId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { practitionerId } = parseArgsAndEnvVars(scriptConfig) as {
  practitionerId: string;
};

const getUsersRole = async ({
  applicationContext,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  userId: string;
}): Promise<string | undefined> => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  'pk.S': `user|${userId}`,
                },
              },
              {
                term: {
                  'sk.S': `user|${userId}`,
                },
              },
            ],
          },
        },
        size: 1,
      },
      index: 'efcms-user',
    },
  });
  return results[0]?.role;
};

const getPractitionersCases = async ({
  applicationContext,
  role,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  role: string;
  userId: string;
}): Promise<RawCase[]> => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  [`${role}s.L.M.userId.S`]: userId,
                },
              },
            ],
          },
        },
        size: 10000,
      },
      index: 'efcms-case',
    },
  });
  return results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const role = await getUsersRole({
    applicationContext,
    userId: practitionerId,
  });
  if (role !== 'irsPractitioner' && role !== 'privatePractitioner') {
    console.log(`Error: user is not a practitioner! User's role: ${role}`);
    return;
  }
  const practitionersCases: RawCase[] = await getPractitionersCases({
    applicationContext,
    role,
    userId: practitionerId,
  });
  const practitionersEmailInCases = {};
  for (const practitionersCase of practitionersCases) {
    const practitionerObj = practitionersCase[`${role}s`]?.find(
      pract => pract.userId === practitionerId,
    );
    if (practitionerObj && practitionerObj.email) {
      practitionersEmailInCases[practitionersCase.docketNumber] =
        practitionerObj.email;
    }
  }
  console.log(practitionersEmailInCases);
})();
