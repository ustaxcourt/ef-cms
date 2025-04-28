import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteUserRecord = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUser',
    where: cb => cb.where('userId', '=', userId),
  });
};
