import { state } from 'cerebral';

/**
 * Sends a case to the IRS holding queue.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the sendPetitionToIRSHoldingQueue use case
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail and state.user.token
 * @param {Object} providers.props the cerebral props object which will set the props.docketNumber after sending to the irs holding queue
 * @returns {Object} the success alert
 */
export const sendPetitionToIRSHoldingQueueAction = async ({
  applicationContext,
  get,
  props,
}) => {
  await applicationContext.getUseCases().sendPetitionToIRSHoldingQueue({
    applicationContext,
    caseId: get(state.caseDetail).caseId,
  });
  props.docketNumber = get(state.caseDetail).docketNumber;
  return {
    alertSuccess: {
      message: 'It can be recalled before 3 pm.',
      title: 'The petition is now batched for IRS service.',
    },
  };
};
