import { OutboxDynamoRecord } from '../dynamoTypes';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCServedForSection = ({
  afterDate,
  applicationContext,
  section,
}: {
  afterDate: string;
  applicationContext: IApplicationContext;
  section: string;
}) => {
  return queryFull({
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
  }) as Promise<OutboxDynamoRecord[]>;
};
