import { combineContactErrors } from './validateAddPractitionerAction';
import { state } from '@web-client/presenter/app.cerebral';

export const validatePractitionerAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const practitioner = get(state.form);

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
      'practiceType',
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
