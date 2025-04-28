import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deletePractitionerRecord = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwPractitioner',
    where: cb => cb.where('userId', '=', userId),
  });
};
