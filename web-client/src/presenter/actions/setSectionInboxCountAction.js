import { state } from 'cerebral';

/**
 * sets the state.workQueue based on the props.workItems passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext used for the getUniqueId method
 * @param {object} providers.store the cerebral store used for setting state.workQueue
 * @param {object} providers.props the cerebral props object used for getting the props.workItems
 * @returns {undefined}
 */
export const setSectionInboxCountAction = ({ store, props }) => {
  store.set(state.sectionInboxCount, props.workItems.length);
};
