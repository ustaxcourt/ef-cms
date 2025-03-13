import { query } from '../../dynamodbClientService';

export const getEligibleCasesForTrialCityDeprecated = async ({
  applicationContext,
  procedureType,
  trialCity,
}: {
  applicationContext: IApplicationContext;
  procedureType: string;
  trialCity: string;
}) => {
  const prefix = `${trialCity}-${procedureType.charAt(0)}`;
  const eligibleCases = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
      ':prefix': prefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return eligibleCases;
};
