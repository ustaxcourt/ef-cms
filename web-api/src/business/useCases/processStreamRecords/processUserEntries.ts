// import { getLogger } from '@web-api/utilities/logger/getLogger';
// import { unmarshall } from '@aws-sdk/util-dynamodb';
// import { RawUser } from '@shared/business/entities/User';
// import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const processUserEntities = ({
  userRecords,
}: {
  userRecords: any[];
}) => {
  if (!userRecords.length) return;

  // getLogger().debug(`going to index ${userRecords.length} user records`);

  // await upsertUsers(
  //   userRecords.map(userRecord => {
  //     return unmarshall(userRecord.dynamodb.NewImage) as RawUser;
  //   }),
  // );
};
