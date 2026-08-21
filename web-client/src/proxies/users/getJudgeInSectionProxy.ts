import { RawUser } from '@shared/business/entities/User';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getJudgeInSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
): Promise<RawUser> => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/judge`,
  });
};
