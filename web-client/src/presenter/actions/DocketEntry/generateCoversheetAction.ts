import { state } from '@web-client/presenter/app.cerebral';

/**
 * Generates a coversheet for the docket entry set on state
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.props the cerebral props function
 */
export const generateCoversheetAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { docketEntryId } = props;

  await applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
};
