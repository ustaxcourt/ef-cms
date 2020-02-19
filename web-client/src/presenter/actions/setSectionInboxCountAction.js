import { filterQcItemsByAssociatedJudge } from '../utilities/filterQcItemsByAssociatedJudge';
import { state } from 'cerebral';

/**
 * sets the state.sectionInboxCount based on the current user and work queue to display
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setSectionInboxCountAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const judgeUser = get(state.judgeUser);

  const additionalFilters = filterQcItemsByAssociatedJudge({
    applicationContext,
    judgeUser,
  });

  const workQueueIsInternal = get(state.workQueueToDisplay.workQueueIsInternal);
  store.set(
    state.sectionInboxCount,
    props.workItems.filter(
      item =>
        item.isQC === !workQueueIsInternal &&
        item.document.isFileAttached !== false &&
        additionalFilters(item),
    ).length,
  );
};
