import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteUserCaseNote = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  await pgDeleteFrom({
    table: 'dwUserCaseNote',
    where: cb =>
      cb.where('docketNumber', '=', docketNumber).where('userId', '=', userId),
  });
};
