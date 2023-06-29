import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate the trial session planning modal
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateTrialSessionPlanningAction = ({
  get,
  path,
}: ActionProps) => {
  const { term, year } = get(state.modal);

  let errors = null;
  if (!term || !year) {
    errors = {};
    if (!term) {
      errors.term = 'Select a term';
    }

    if (!year) {
      errors.year = 'Select a year';
    }
  }

  if (errors) {
    return path.error({ errors });
  } else {
    return path.success();
  }
};
