import { state } from 'cerebral';

/**
 * updates the petitioner information action
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab, caseDetail
 */
export const updatePetitionerInformationAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { contactPrimary, contactSecondary, partyType } = get(state.form);

  const {
    paperServiceParties,
    paperServicePdfUrl,
    updatedCase,
  } = await applicationContext
    .getUseCases()
    .updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary,
      contactSecondary,
      docketNumber,
      partyType,
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
    docketNumber,
    paperServiceParties,
    pdfUrl: paperServicePdfUrl,
    tab: 'caseInfo',
  };
};
