import { remove } from '../../dynamodbClientService';

export const removeIrsPractitionerOnCase = ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  remove({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `irsPractitioner|${userId}`,
    },
  });

export const removePrivatePractitionerOnCase = ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  remove({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `privatePractitioner|${userId}`,
    },
  });
