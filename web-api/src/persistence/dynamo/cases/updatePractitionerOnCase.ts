import { put } from '../../dynamodbClientService';

export const updateIrsPractitionerOnCase = ({
  applicationContext,
  docketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  practitioner: TPractitioner;
  userId: string;
}) =>
  put({
    Item: {
      ...practitioner,
      pk: `case|${docketNumber}`,
      sk: `irsPractitioner|${userId}`,
    },
    applicationContext,
  });

export const updatePrivatePractitionerOnCase = ({
  applicationContext,
  docketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  practitioner: TPractitioner;
  userId: string;
}) =>
  put({
    Item: {
      ...practitioner,
      pk: `case|${docketNumber}`,
      sk: `privatePractitioner|${userId}`,
    },
    applicationContext,
  });
