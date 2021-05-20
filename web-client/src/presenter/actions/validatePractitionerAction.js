import { combineContactErrors } from './validateAddPractitionerAction';
import { state } from 'cerebral';

/**
 * validates the practitioner user form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} providers.path the next path based on if validation was successful or error
 * @param {object} providers.props the props passed in to the action
 */
export const validatePractitionerAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const practitioner = get(state.form);
  practitioner.admissionsDate = props.computedDate;

  const errors = applicationContext
    .getUseCases()
    .validatePractitionerInteractor(applicationContext, {
      practitioner,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'firstName',
      'lastName',
      'birthYear',
      'practitionerType',
      'employer',
      'country',
      'address1',
      'city',
      'state',
      'postalCode',
      'phone',
      'originalBarState',
      'admissionsStatus',
      'admissionsDate',
      'updatedEmail',
      'confirmEmail',
    ];

    combineContactErrors({ errors });

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
