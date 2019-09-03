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
export const setSectionInboxCountAction = ({ get, props, store }) => {
  const workQueueIsInternal = get(state.workQueueToDisplay.workQueueIsInternal);
  store.set(
    state.sectionInboxCount,
    props.workItems
      .filter(item => item.isInternal === workQueueIsInternal)
      .filter(item => item.document.isFileAttached !== false).length,
  );
};
