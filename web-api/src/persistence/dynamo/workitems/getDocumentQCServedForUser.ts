import { RawWorkItem } from '@shared/business/entities/WorkItem';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCServedForUser = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const afterDate = calculateISODate({
    dateString: createISODateAtStartOfDayEST(),
    howMuch: -7,
    units: 'days',
  });

  return queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `user-outbox|${userId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  }) as unknown as Promise<RawWorkItem[]>;
};
