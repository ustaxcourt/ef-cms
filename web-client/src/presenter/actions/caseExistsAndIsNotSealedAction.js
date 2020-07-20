/**
 * Checks for existence of a case using the getCaseForPublicDocketSearchInteractor use case using the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCaseForPublicDocketSearchInteractor use case
 * @param {object} providers.path provides execution path choices depending on the existence of the case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const caseExistsAndIsNotSealedAction = async ({
  applicationContext,
  path,
  props,
}) => {
  try {
    const caseDetail = await applicationContext
      .getUseCases()
      .getCaseForPublicDocketSearchInteractor({
        applicationContext,
        docketNumber: props.docketNumber,
      });

    return path.success({ caseDetail });
  } catch (e) {
    return path.error();
  }
};
