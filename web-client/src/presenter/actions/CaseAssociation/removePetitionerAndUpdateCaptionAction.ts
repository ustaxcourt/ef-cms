import { state } from 'cerebral';

/**
 * updates case caption and removes a petitioner from the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context for getting constants
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @returns {object} the next path based on if validation was successful or error
 */
export const removePetitionerAndUpdateCaptionAction = async ({
  applicationContext,
  get,
}) => {
  const { CONTACT_TYPE_TITLES } = applicationContext.getConstants();

  const { docketNumber, petitioners } = get(state.caseDetail);
  const { contactId } = get(state.form.contact);
  const { caseCaption } = get(state.modal);

  const { contactType } = petitioners.find(p => p.contactId === contactId);

  const updatedCaseDetail = await applicationContext
    .getUseCases()
    .removePetitionerAndUpdateCaptionInteractor(applicationContext, {
      caseCaption,
      contactId,
      docketNumber,
    });

  const title = CONTACT_TYPE_TITLES[contactType];

  return {
    alertSuccess: {
      message: `${title} successfully removed.`,
    },
    caseDetail: updatedCaseDetail,
    contactType,
    docketNumber,
    tab: 'caseInfo',
  };
};
