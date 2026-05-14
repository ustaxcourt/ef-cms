import { RawUser } from '@shared/business/entities/User';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicUsersInSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section }: { section: string },
): Promise<RawUser[]> => {
  return get({
    applicationContext,
    endpoint: `/public-api/sections/${section}/users`,
  });
};
