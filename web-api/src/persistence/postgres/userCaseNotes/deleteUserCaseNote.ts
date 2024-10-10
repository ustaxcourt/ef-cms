import { getDbWriter } from '@web-api/database';

export const deleteUserCaseNote = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  await getDbWriter(writer =>
    writer
      .deleteFrom('dwUserCaseNote')
      .where('docketNumber', '=', docketNumber)
      .where('userId', '=', userId)
      .execute(),
  );
};
