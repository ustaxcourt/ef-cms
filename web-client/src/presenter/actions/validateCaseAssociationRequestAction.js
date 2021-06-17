import { state } from 'cerebral';

/**
 * validates the case association request.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCaseAssociationRequestAction = ({
  applicationContext,
  get,
  path,
}) => {
  const caseAssociationRequest = {
    ...get(state.form),
  };

  const errors = applicationContext
    .getUseCases()
    .validateCaseAssociationRequestInteractor({
      caseAssociationRequest,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'supportingDocument',
      'supportingDocumentFreeText',
      'supportingDocumentFile',
      'documentType',
      'primaryDocumentFile',
      'certificateOfService',
      'certificateOfServiceDate',
      'attachments',
      'objections',
      'hasSupportingDocuments',
      'supportingDocuments',
      'filers',
    ];

    const errorDisplayMap = {
      secondarySupportingDocuments: 'Secondary Supporting Document',
      supportingDocuments: 'Supporting Document',
    };

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayMap,
      errorDisplayOrder,
      errors,
    });
  }
};
