import { put } from '../../dynamodbClientService';

export const updateUserCaseMapping = ({
  applicationContext,
  userCaseItem,
}: {
  applicationContext: IApplicationContext;
  userCaseItem: any;
}) =>
  put({
    Item: {
      ...userCaseItem,
      gsi1pk: `user-case|${userCaseItem.docketNumber}`,
    },
    applicationContext,
  });
