import { state } from 'cerebral';

/**
 * validates the select document type form.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateSelectDocumentTypeAction = ({
  applicationContext,
  get,
  path,
}) => {
  const documentMetadata = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateExternalDocumentInteractor(applicationContext, {
      documentMetadata,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'documentTitle',
      'documentType',
      'freeText',
      'freeText2',
      'previousDocument',
      'serviceDate',
      'trialLocation',
      'ordinalValue',
    ];

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
