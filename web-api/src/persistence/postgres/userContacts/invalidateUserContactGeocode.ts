import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const invalidateUserContactGeocode = async (
  docketNumber: string,
  userId: string,
): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUserContact',
    where: cb =>
      cb.where('userId', '=', userId).where('docketNumber', '=', docketNumber),
  });
};
