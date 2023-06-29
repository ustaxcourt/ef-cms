import { state } from '@web-client/presenter/app.cerebral';

/**
 * Invokes the path in the sequence based on whether the user has successfully
 * submitted a petition.
 * If the petition has been successfully filed, redirect to the success page.
 * If not, redirect to the dashboard.
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.get the cerebral get helper function
 * @returns {object} continue path for the sequence
 */
export const getShouldRedirectToFilePetitionSuccessAction = ({
  get,
  path,
}: ActionProps) => {
  const currentPage = get(state.currentPage);
  const docketNumber = get(state.caseDetail.docketNumber);
  const wizardStep = get(state.form.wizardStep);

  if (currentPage === 'StartCaseWizard' && docketNumber && wizardStep === '5') {
    return path.yes();
  }

  return path.no();
};
