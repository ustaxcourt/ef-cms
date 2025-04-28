import { pgDeleteFrom } from '../../utils/operation/pgDeleteFrom';

export const deleteUserFromCase = async ({
  userId,
  docketNumber,
}: {
  docketNumber?: string;
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUserOnCase',
    where: cb => {
      if (docketNumber) {
        return cb
          .where('userId', '=', userId)
          .where('docketNumber', '=', docketNumber);
      }
      return cb.where('userId', '=', userId);
    },
  });
};
