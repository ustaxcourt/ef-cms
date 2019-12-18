import { state } from 'cerebral';

/**
 * calls the unblockCaseFromTrialInteractor to remove the block on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const unblockCaseFromTrialAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId } = get(state.caseDetail);

  const caseDetail = await applicationContext
    .getUseCases()
    .unblockCaseFromTrialInteractor({
      applicationContext,
      caseId,
    });

  return {
    alertSuccess: {
      message:
        'This case will be eligible to be set for the next available trial session.',
      title: 'The block on this case has been removed',
    },
    caseDetail,
  };
};
