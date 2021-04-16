import { state } from 'cerebral';

/**
 * updates the petitioner information action
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseDetail, docketNumber, paperServiceParties, pdfUrl, tab
 */
export const addPetitionerToCaseAction = async ({ get }) => {
  const { docketNumber } = get(state.caseDetail);
  const { contact } = get(state.form);

  // todo: connect back end as part of next task
  // const updatedCase = applicationContext
  //   .getUseCases()
  //   .addPetitionerToCaseInteractor({
  //     applicationContext,
  //     contact,
  //     docketNumber,
  //   });

  return {
    alertSuccess: {
      message: `Petitioner ${contact.name} has been added to case.`,
    },
    // caseDetail: updatedCase,
    docketNumber,
    tab: 'caseInfo',
  };
};
