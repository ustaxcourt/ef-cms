// usage: npx ts-node --transpile-only scripts/run-once-scripts/find-petitioners-missing-cases.ts

import '../../types/IApplicationContext';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { searchAll } from '../../web-api/src/persistence/elasticsearch/searchClient';
import type { RawPractitioner } from '../../shared/src/business/entities/Practitioner';

const getOpenCases = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
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

// const isPractitionerInCognito = async email => {
//   try {
//     const user = await cognito
//       .adminGetUser({
//         UserPoolId: cognitoPoolId,
//         Username: email,
//       })
//       .promise();
//     if (
//       user.UserAttributes.find(attribute => attribute.Name === 'custom:role')
//         .Value === 'privatePractitioner'
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     return false;
//   }
// };

const getPrivatePractitionersOnCase = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<RawPractitioner[]> => {
  let privatePractitioners: RawPractitioner[] = [];
  const result = await applicationContext
    .getDocumentClient(applicationContext)
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const allOpenCases = await getOpenCases({ applicationContext });

  console.log(`found ${allOpenCases.length} open cases`);
  let i = 1;

  for (let openCase of allOpenCases) {
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
      // const isEmailActuallyAPractitionerEmail = await isPractitionerInCognito(
      //   email,
      // );
      // if (isEmailActuallyAPractitionerEmail) {
      //   console.log(
      //     `case of ${openCase.docketNumber} is bad: ${email} should be removed from contactPrimary`,
      //   );
      // }
    }
  }
})();
