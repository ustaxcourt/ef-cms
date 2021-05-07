import { state } from 'cerebral';

/**
 * updates case caption and removes a petitioner from the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context for getting constants
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @returns {object} the next path based on if validation was successful or error
 */
export const removePetitionerFromCaseAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const { contactId } = get(state.form.contact);
  const { caseCaption } = get(state.modal);

  const updatedCaseDetail = await applicationContext
    .getUseCases()
    .removePetitionerAndUpdateCaptionInteractor({
      applicationContext,
      caseCaption,
      contactId,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Petitioner removed.',
    },
    caseDetail: updatedCaseDetail,
    docketNumber,
    tab: 'caseInfo',
  };
};
