import * as client from '../../dynamodbClientService';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';

/**
 * getCasesForUser
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the userId to filter cases by
 * @returns {object} the case data
 */
export const getCasesForUser = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) =>
  client.queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  }) as unknown as Promise<Case[]>;
