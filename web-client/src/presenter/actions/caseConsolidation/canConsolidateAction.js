/**
 * check to see if we can consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {object} the path to take next
 */
export const canConsolidateAction = async ({
  applicationContext,
  path,
  props,
}) => {
  const { caseDetail, caseToConsolidate, confirmSelection } = props;

  if (!confirmSelection) {
    return path.error({
      error: 'Select a case',
    });
  }

  const results = applicationContext
    .getUseCases()
    .canConsolidateInteractor(applicationContext, {
      caseToConsolidate,
      currentCase: caseDetail,
    });

  if (results.canConsolidate) {
    return path.success();
  } else {
    return path.error({
      error: results.reason,
    });
  }
};
