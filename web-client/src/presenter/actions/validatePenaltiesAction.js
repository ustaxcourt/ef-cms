/**
 * validates the penalty.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePenaltiesAction = ({
  applicationContext,
  get,
  path,
  props,
  state,
}) => {
  const { statisticId } = get(state.form);
  const { penalties } = props;

  let errors = [];

  penalties.forEach(penalty => {
    penalty.statisticId = statisticId;
    let error = applicationContext
      .getUseCases()
      .validatePenaltiesInteractor(applicationContext, { rawPenalty: penalty });
    errors.push(error);
  });

  if (!errors) {
    return path.success({ penalties });
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
