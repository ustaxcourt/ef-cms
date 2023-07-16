/**
 * update props from modal state to pass to other actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const deleteCasePrimaryIssueInDBAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber } = props;
  await applicationContext
    .getUseCases()
    .updateCasePrimaryIssueInteractor(applicationContext, {
      docketNumber,
      primaryIssue: undefined,
    });
};
