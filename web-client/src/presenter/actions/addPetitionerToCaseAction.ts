import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates the petitioner information action
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseDetail, docketNumber, contactType, tab
 */
export const addPetitionerToCaseAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { CONTACT_TYPE_TITLES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;
  const { contact } = get(state.form);

  await applicationContext
    .getUseCases()
    .addPetitionerToCaseInteractor(applicationContext, {
      caseCaption: contact.caseCaption,
      contact,
      docketNumber,
    });
  const contactTypeDisplay = CONTACT_TYPE_TITLES[contact.contactType];

  return {
    alertSuccess: {
      message: `${contactTypeDisplay} ${contact.name} has been added to the case.`,
    },
    // the API does not return the updated case; include the new party so
    // setPartyViewTabAfterUpdatingPetitionersAction can pick the right tab
    caseDetail: {
      ...caseDetail,
      petitioners: [...(caseDetail.petitioners || []), contact],
    },
    contactType: contact.contactType,
    docketNumber,
    tab: 'caseInfo',
  };
};
