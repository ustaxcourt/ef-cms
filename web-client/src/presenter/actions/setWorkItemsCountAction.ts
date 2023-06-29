import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets individual and section inbox and in progress work items counts
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */

export const setWorkItemsCountAction = ({ get, store }: ActionProps) => {
  const notifications = get(state.notifications);

  store.set(state.sectionInboxCount, notifications.qcSectionInboxCount);

  store.set(
    state.sectionInProgressCount,
    notifications.qcSectionInProgressCount,
  );

  store.set(state.individualInboxCount, notifications.qcIndividualInboxCount);

  store.set(
    state.individualInProgressCount,
    notifications.qcIndividualInProgressCount,
  );
};
