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
  const currentUser = applicationContext.getCurrentUser();
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();
  const judgeUser = get(state.judgeUser);

  let additionalFilters = () => true;

  if (judgeUser) {
    additionalFilters = item =>
      item.associatedJudge && item.associatedJudge === judgeUser.name;
  } else if (currentUser.role === USER_ROLES.adc) {
    additionalFilters = item =>
      !item.associatedJudge || item.associatedJudge === CHIEF_JUDGE;
  }

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
