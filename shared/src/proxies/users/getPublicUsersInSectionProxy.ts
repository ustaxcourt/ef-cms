import { RawUser } from '@shared/business/entities/User';
import { get } from '../requests';

export const getPublicUsersInSectionInteractor = (
  applicationContext,
  { section }: { section: string },
): Promise<RawUser[]> => {
  return get({
    applicationContext,
    endpoint: `/public-api/sections/${section}/users`,
  });
};
