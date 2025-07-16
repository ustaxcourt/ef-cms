import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteUserConnection = async ({
  connectionId,
}: {
  connectionId: string;
}) => {
  if (!connectionId) return;

  await pgDeleteFrom({
    table: 'dwConnection',
    where: cb => cb.where('connectionId', '=', connectionId),
  });
};
