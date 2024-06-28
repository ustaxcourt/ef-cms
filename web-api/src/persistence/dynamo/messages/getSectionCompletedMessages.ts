import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import type { RawMessage } from '@shared/business/entities/Message';

export const getSectionCompletedMessages = async ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<RawMessage[]> => {
  const afterDate = calculateISODate({
    dateString: createISODateAtStartOfDayEST(),
    howMuch: -7,
    units: 'days',
  });

  const results = await queryFull<RawMessage>({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `message|completed|section|${section}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });

  return results;
};
