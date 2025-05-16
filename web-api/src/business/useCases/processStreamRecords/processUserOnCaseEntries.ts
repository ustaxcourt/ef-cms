import { unmarshall } from '@aws-sdk/util-dynamodb';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

export const processUserOnCaseEntries = async ({
  userOnCaseRecords,
}: {
  userOnCaseRecords: any[];
}) => {
  if (!userOnCaseRecords.length) return;

  await userOnCaseRecords.forEach(async userOnCaseRecord => {
    const record = unmarshall(userOnCaseRecord.dynamodb.NewImage);

    await associateUserWithCase({
      userId: record.userId,
      docketNumber: record.docketNumber,
      entityName: record.entityName,
    });
  });
};
