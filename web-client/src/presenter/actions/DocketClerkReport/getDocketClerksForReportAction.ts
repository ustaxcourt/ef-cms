import { RawUser } from '@shared/business/entities/User';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the list of docket clerks (users in the docket section) for the
 * docket clerk report picker
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const getDocketClerksForReportAction = async ({
  applicationContext,
  store,
}: ActionProps): Promise<void> => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  const users: RawUser[] = await applicationContext
    .getUseCases()
    .getUsersInSectionInteractor(applicationContext, {
      section: DOCKET_SECTION,
    });

  store.set(state.docketClerkReport.docketClerks, sortBy(users, 'name'));
};
