import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
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
  store,
}) => {
  const {
    CONTACT_TYPE_TITLES,
    PARTY_VIEW_TABS,
  } = applicationContext.getConstants();

  const { docketNumber, petitioners } = get(state.caseDetail);
  const { contactId } = get(state.form.contact);
  const { caseCaption } = get(state.modal);

  const { contactType } = petitioners.find(p => p.contactId === contactId);
  const title = CONTACT_TYPE_TITLES[contactType];

  const updatedCaseDetail = await applicationContext
    .getUseCases()
    .removePetitionerAndUpdateCaptionInteractor(applicationContext, {
      caseCaption,
      contactId,
      docketNumber,
    });

  let tab;

  console.log('ciontactt[4em ', contactType);

  if (
    contactType === CONTACT_TYPES.intervenor ||
    contactType === CONTACT_TYPES.participant
    // (and there are more intervenors or participants left on the case)
  ) {
    tab = PARTY_VIEW_TABS.participantsAndCounsel;
  } else {
    tab = PARTY_VIEW_TABS.petitionersAndCounsel;
  }
  console.log(tab);
  store.set(state.screenMetadata.partyViewTab, tab);

  return {
    alertSuccess: {
      message: `${title} successfully removed.`,
    },
    caseDetail: updatedCaseDetail,
    docketNumber,
    tab: 'caseInfo',
  };
};
