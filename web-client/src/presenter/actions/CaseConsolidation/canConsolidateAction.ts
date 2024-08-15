import { state } from '@web-client/presenter/app.cerebral';

/**
 * check to see if we can consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {object} the path to take next
 */
export const canConsolidateAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { caseDetail, caseToConsolidate, confirmSelection } = props;
  const user = get(state.user);

  if (!confirmSelection) {
    return path.error({
      error: 'Select a case',
    });
  }

  const results = applicationContext
    .getUseCases()
    .canConsolidateInteractor(user, {
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
