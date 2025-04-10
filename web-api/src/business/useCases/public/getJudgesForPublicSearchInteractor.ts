import { getUsersInSection } from '@web-api/persistence/postgres/users/getUsersInSection';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getJudgesForPublicSearchInteractor = async () => {
  const rawJudges = await getUsersInSection({ section: ROLES.judge });

  return PublicUser.validateRawCollection(rawJudges);
};
