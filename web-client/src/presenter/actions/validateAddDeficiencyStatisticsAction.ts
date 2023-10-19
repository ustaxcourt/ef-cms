import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the add deficiency statistic.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateAddDeficiencyStatisticsAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const form = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validateAddDeficiencyStatisticsInteractor(applicationContext, {
      statistic: form,
    });

  // we show this error when the calculate modal is not used to generate irsTotalPenalties
  if (errors && errors.irsTotalPenalties && errors.penalties) {
    delete errors.penalties;
    errors.irsTotalPenalties =
      'Use IRS Penalty Calculator to calculate total penalties.';
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
