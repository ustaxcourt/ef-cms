import { state } from 'cerebral';

/**
 * sets the state.workQueue based on the props.workItems passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the applicationContext used for the getUniqueId method
 * @param {Object} providers.store the cerebral store used for setting state.workQueue
 * @param {Object} providers.props the cerebral props object used for getting the props.workItems
 * @returns {undefined}
 */
export const setSectionInboxCountAction = ({ store, props }) => {
  store.set(state.sectionInboxCount, props.workItems.length);
};
