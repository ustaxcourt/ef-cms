import { RawUser } from '@shared/business/entities/User';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUsersInSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section }: { section: string },
): Promise<RawUser[]> => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/users`,
  });
};
