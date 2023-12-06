import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { sortBy } from 'lodash';

/**
 * fetch the public list of judges
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the get use case
 * @returns {object} contains the public list of judges
 */
export const getPublicJudgesAction = async ({
  applicationContext,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const judges = await applicationContext
    .getUseCases()
    .getPublicJudgesInteractor(applicationContext);

  return {
    users: sortBy(judges, 'name'),
  };
};
