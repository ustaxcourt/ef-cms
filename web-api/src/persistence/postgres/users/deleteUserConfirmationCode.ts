import { pgDeleteFrom } from '../utils/operation/pgDeleteFrom';

export const deleteUserConfirmationCode = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUserConfirmationCode',
    where: cb => cb.where('userId', '=', userId),
  });
};
