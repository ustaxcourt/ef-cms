import { state } from 'cerebral';

/**
 * returns a path based upon if any order-related values for a given case
 * are set to true, in which it returns path.yes(); otherwise, path.no()
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the paths for next execution
 * @returns {object} the path to execute next
 */
export const checkForOrdersNeededAction = async ({ get, path }) => {
  const caseDetail = get(state.caseDetail);

  if (!caseDetail) {
    return path.no();
  }

  const {
    noticeOfAttachments,
    orderDesignatingPlaceOfTrial,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
  } = caseDetail;

  const ordersNeeded = [
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
    noticeOfAttachments,
    orderDesignatingPlaceOfTrial,
  ].some(val => !!val);

  if (ordersNeeded) {
    return path.yes();
  }

  return path.no();
};
