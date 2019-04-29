import { state } from 'cerebral';

/**
 * validates the case association request.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the use case
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Object} providers.get the cerebral get function used for getting state.form
 * @returns {Object} the next path based on if validation was successful or error
 */
export const validateCaseAssociationRequestAction = ({
  applicationContext,
  path,
  get,
}) => {
  const caseAssociationRequest = {
    ...get(state.form),
  };

  const errors = applicationContext
    .getUseCases()
    .validateCaseAssociationRequest({
      applicationContext,
      caseAssociationRequest,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'documentType',
      'primaryDocumentFile',
      'certificateOfService',
      'certificateOfServiceDate',
      'objections',
      'representingPrimary',
      'representingSecondary',
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
