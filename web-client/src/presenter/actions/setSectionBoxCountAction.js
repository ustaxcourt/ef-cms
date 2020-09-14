import { state } from 'cerebral';

/**
 * sets based on the current user and work queue to display
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */

// TODO 6069 - Rename to setBoxCount
export const setSectionBoxCountAction = ({ get, store }) => {
  const notifications = get(state.notifications);

  store.set(state.sectionInboxCount, notifications.qcSectionInboxCount);

  store.set(
    state.sectionInProgressCount,
    notifications.qcSectionInProgressCount,
  );

  store.set(state.individualInboxCount, notifications.qcIndividialInboxCount);

  store.set(
    state.individualInProgressCount,
    notifications.qcIndividualInProgressCount,
  );
};
