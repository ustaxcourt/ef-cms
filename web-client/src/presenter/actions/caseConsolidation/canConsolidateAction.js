/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
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

  const { Case } = applicationContext.getEntityConstructors();

  const caseEntity = new Case(caseDetail, { applicationContext });

  const results = caseEntity.getConsolidationStatus(caseToConsolidate);

  if (results.canConsolidate) {
    return path.success();
  } else {
    return path.error({
      error: results.reason,
    });
  }
};
