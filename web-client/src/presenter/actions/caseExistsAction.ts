/**
 * Checks for existence of a case using the getCase use case using the props.docketNumber
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.path provides execution path choices depending on the existence of the case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const caseExistsAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  try {
    await applicationContext
      .getUseCases()
      .getCaseExistsInteractor(applicationContext, {
        docketNumber: props.docketNumber,
      });

    return path.success({ docketNumber: props.docketNumber });
  } catch (e) {
    return path.error();
  }
};
