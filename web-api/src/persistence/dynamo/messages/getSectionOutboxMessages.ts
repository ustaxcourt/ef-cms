import { RawMessage } from '@shared/business/entities/Message';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { queryFull } from '@web-api/persistence/dynamodbClientService';

export const getSectionOutboxMessages = async ({
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

  const results = (await queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `message|outbox|section|${section}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  })) as unknown as RawMessage[];

  return results;
};
