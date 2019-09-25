import { state } from 'cerebral';

/**
 * sets the state.caseDetail.judgeNotes
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the paths for next execution
 * @returns {object} the path to execute next
 */
export const checkForOrdersNeededAction = async ({ get, path }) => {
  const {
    noticeOfAttachments,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
  } = get(state.caseDetail);

  console.log('yee haw');

  const ordersNeeded = [
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
    noticeOfAttachments,
  ].some(val => !!val);

  if (ordersNeeded) {
    return path.yes();
  }

  return path.no();
};
