import * as client from '../../dynamodbClientService';

export const getPractitionerDocuments = async ({
  applicationContext,
  barNumber,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
}) => {
  barNumber = barNumber.toLowerCase();

  return (await client.queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `practitioner|${barNumber}`,
      ':prefix': 'document',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  })) as unknown as Promise<RawPractitionerDocument[]>;
};
