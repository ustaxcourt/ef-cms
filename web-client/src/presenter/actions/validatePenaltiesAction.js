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
  path,
  props,
}) => {
  const { penalties } = props;

  let errors = {};

  if (penalties.length < 1) {
    errors = {
      penaltyAmount: 'Please enter a penalty.',
    };
  }

  penalties.forEach(penalty => {
    let error = applicationContext
      .getUseCases()
      .validatePenaltiesInteractor(applicationContext, { rawPenalty: penalty });

    error && (errors = { ...errors, ...error });
  });

  if (Object.keys(errors).length < 1) {
    return path.success(props);
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      error: errors,
    });
  }
};
