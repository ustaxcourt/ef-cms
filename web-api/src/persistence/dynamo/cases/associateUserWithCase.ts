import { RawUserCase } from '@shared/business/entities/UserCase';
import { put } from '../../dynamodbClientService';

export const associateUserWithCase = ({
  applicationContext,
  docketNumber,
  userCase,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  userCase: RawUserCase;
  userId: string;
}) =>
  put({
    Item: {
      ...userCase,
      gsi1pk: `user-case|${docketNumber}`,
      pk: `user|${userId}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });
