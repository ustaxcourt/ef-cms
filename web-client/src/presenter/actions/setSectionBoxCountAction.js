import { filterQcItemsByAssociatedJudge } from '../utilities/filterQcItemsByAssociatedJudge';
import { state } from 'cerebral';

/**
 * sets the state.sectionInboxCount and state.sectionInProgressCount based on the current user and work queue to display
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setSectionBoxCountAction = ({
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

  store.set(
    state.sectionInboxCount,
    props.workItems.filter(
      item =>
        item.docketEntry.isFileAttached !== false &&
        additionalFilters(item) &&
        !item.caseIsInProgress,
    ).length,
  );

  store.set(
    state.sectionInProgressCount,
    props.workItems.filter(
      item =>
        item.docketEntry.isFileAttached !== false &&
        additionalFilters(item) &&
        item.caseIsInProgress,
    ).length,
  );
};
