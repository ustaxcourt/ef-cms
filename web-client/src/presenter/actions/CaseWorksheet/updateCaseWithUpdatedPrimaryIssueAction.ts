/**
 * Updates the trial session working copy
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the updateTrialSessionWorkingCopyInteractor use case
 * @returns {object} contains the updated trial session working copy returned from the use case
 */
export const updateCasePrimaryIssueInDbAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, primaryIssue } = props;
  await applicationContext
    .getUseCases()
    .updateCasePrimaryIssueInteractor(applicationContext, {
      docketNumber,
      primaryIssue,
    });
};
