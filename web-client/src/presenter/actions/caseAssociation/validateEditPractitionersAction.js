import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the petition.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateEditPractitionersAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { practitioners } = get(state.form);

  const errors = [];
  practitioners.forEach(practitioner => {
    const error = applicationContext
      .getUseCases()
      .validateEditPractitionerInteractor({
        applicationContext,
        practitioner,
      });
    errors.push(error);
  });

  if (errors.filter(item => !isEmpty(item)).length === 0) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: { practitioners: errors },
    });
  }
};
