import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the add practitioner document form.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateAddPractitionerDocumentFormAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const form = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validateAddPractitionerDocumentFormInteractor(applicationContext, form);

  if (errors?.fileName) {
    delete errors.fileName;
    errors.practitionerDocumentFile = 'Please provide a file';
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: omit(errors, 'categoryName'),
    });
  }
};
