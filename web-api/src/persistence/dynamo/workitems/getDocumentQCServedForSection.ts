import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { queryFull } from '../../dynamodbClientService';
import type { RawWorkItem } from '@shared/business/entities/WorkItem';

export const getDocumentQCServedForSection = ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<RawWorkItem[]> => {
  const afterDate = calculateISODate({
    dateString: createISODateAtStartOfDayEST(),
    howMuch: -7,
    units: 'days',
  });

  const results = queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `section-outbox|${section}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  }) as unknown as Promise<RawWorkItem[]>;

  return results;
};
