import { getUsersInSections } from '@web-api/persistence/postgres/users/getUsersInSections';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getJudgesForPublicSearchInteractor = async () => {
  const rawJudges = await getUsersInSections({ sections: [ROLES.judge] });

  return PublicUser.validateRawCollection(rawJudges);
};
