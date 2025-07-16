#!/usr/bin/env -S npx ts-node --transpile-only

import { type RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description:
    'find-cases-linked-to-practitioners - Identifies cases in which a practitioner appears as a petitioner.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const getOpenCases = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<RawCase[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber', 'petitioners'],
        query: {
          bool: {
            must_not: [
              {
                terms: { 'status.S': ['Closed', 'Closed - Dismissed'] },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    },
  });

  return results as unknown as RawCase[];
};

const getPrivatePractitionersOnCase = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<RawPractitioner[]> => {
  let privatePractitioners: RawPractitioner[] = [];
  const result = await applicationContext
    .getDocumentClient()
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'privatePractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: applicationContext.environment.dynamoDbTableName,
    });

  if ('Items' in result && result.Items) {
    privatePractitioners = result.Items as unknown as RawPractitioner[];
  }
  return privatePractitioners;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const allOpenCases = await getOpenCases({ applicationContext });

  console.log(`found ${allOpenCases.length} open cases`);
  let i = 1;

  for (const openCase of allOpenCases) {
    console.log(`case ${i++} / ${allOpenCases.length}`);
    const primaryPetitioner = openCase.petitioners.find(
      p => p.contactType === 'primary',
    );
    if (
      primaryPetitioner &&
      'email' in primaryPetitioner &&
      primaryPetitioner.email
    ) {
      const { email } = primaryPetitioner;
      const practitioners = await getPrivatePractitionersOnCase({
        applicationContext,
        docketNumber: openCase.docketNumber,
      });
      if (practitioners.find(practitioner => practitioner.email === email)) {
        console.log(
          `found a practitioner on case ${openCase.docketNumber} that matches contactPrimary.email of ${email}`,
        );
      }
    }
  }
})();
