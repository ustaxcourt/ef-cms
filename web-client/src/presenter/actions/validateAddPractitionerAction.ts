import { state } from 'cerebral';

/**
 * combines contact error fields into a single contact error object -
 * this modifies the original errors object rather than returning the value
 *
 * @param {object} providers the providers object
 * @param {object} providers.errors the errors
 */
export const combineContactErrors = ({ errors }) => {
  if (
    errors.address1 ||
    errors.city ||
    errors.country ||
    errors.postalCode ||
    errors.state ||
    errors.serviceIndicator
  ) {
    errors.contact = {};
    [
      'address1',
      'city',
      'country',
      'postalCode',
      'state',
      'serviceIndicator',
    ].forEach(key => {
      if (errors[key]) {
        errors.contact[key] = errors[key];
        delete errors[key];
      }
    });
  }
};

/**
 * validates the add practitioner user form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} providers.path the next path based on if validation was successful or error
 * @param {object} providers.props the props passed in to the action
 */
export const validateAddPractitionerAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const practitioner = get(state.form);
  practitioner.admissionsDate = props.computedDate;

  const errors = applicationContext
    .getUseCases()
    .validateAddPractitionerInteractor(applicationContext, {
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
      'contact.country',
      'contact.address1',
      'contact.city',
      'contact.state',
      'contact.postalCode',
      'phone',
      'email',
      'confirmEmail',
      'originalBarState',
      'admissionsStatus',
      'admissionsDate',
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
