import { state } from 'cerebral';
import { omit } from 'lodash';

/**
 * validates the select document type form.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Object} providers.get the cerebral get function used for getting state.form
 * @param {Object} providers.props the cerebral props object
 * @returns {Object} the next path based on if validation was successful or error
 */
export const validateSelectDocumentTypeAction = ({
  applicationContext,
  path,
  get,
  props,
}) => {
  const form = get(state.form);

  const errors = {};

  if (!form.category) errors.category = 'You must select a category';
  if (!form.documentType)
    errors.documentType = 'You must select a documentType';

  if (Object.keys(errors).length === 0) {
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
