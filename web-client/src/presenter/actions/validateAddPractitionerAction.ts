import { state } from '@web-client/presenter/app.cerebral';

/**
 * combines contact error fields into a single contact error object -
 * this modifies the original errors object rather than returning the value
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

export const validateAddPractitionerAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const practitioner = get(state.form);

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
