import { pgDeleteFrom } from '../../utils/operation/pgDeleteFrom';

export const deleteUserFromCase = async ({
  userId,
  docketNumber,
}: {
  docketNumber: string;
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUserOnCase',
    where: cb =>
      cb.where('userId', '=', userId).where('docketNumber', '=', docketNumber),
  });
};
