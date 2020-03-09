import { state } from 'cerebral';

/**
 * get alert message when a trial session calendar is created
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the prop of the alert success message
 */
export const getNoticeGenerationSuccessMessageAction = ({ get }) => {
  const currentPage = get(state.currentPage);

  if (currentPage === 'CaseDetailInternal') {
    return {
      alertSuccess: {
        message: 'Trial details are visible under Trial Information.',
        title: 'This case has been set for trial',
      },
    };
  } else {
    return {
      alertSuccess: {
        message: 'You can view all cases set for this trial session below.',
        title: 'Eligible cases have been set for this trial session.',
      },
    };
  }
};
