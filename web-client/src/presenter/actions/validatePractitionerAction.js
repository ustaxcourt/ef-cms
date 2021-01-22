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
    .validatePractitionerInteractor({
      applicationContext,
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
    ];

    //todo refactor as a part of DOD
    if (
      errors.address1 ||
      errors.city ||
      errors.country ||
      errors.postalCode ||
      errors.state
    ) {
      errors.contact = {};
      ['address1', 'city', 'country', 'postalCode', 'state'].forEach(key => {
        if (errors[key]) {
          errors.contact[key] = errors[key];
          delete errors[key];
        }
      });
    }

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
