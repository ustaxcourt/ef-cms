import { state } from 'cerebral';

/**
 * updates the petitioner information action
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseDetail, docketNumber, paperServiceParties, pdfUrl, tab
 */
export const updatePetitionerInformationAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { contact } = get(state.form);

  const { paperServiceParties, paperServicePdfUrl, updatedCase } =
    await applicationContext
      .getUseCases()
      .updatePetitionerInformationInteractor(applicationContext, {
        docketNumber,
        updatedPetitionerData: contact,
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
