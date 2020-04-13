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
        message: 'Case set for trial.',
      },
    };
  } else {
    return {
      alertSuccess: {
        message: 'Eligible cases set for trial.',
      },
    };
  }
};
