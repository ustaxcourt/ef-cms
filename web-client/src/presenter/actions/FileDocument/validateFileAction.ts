import { state } from 'cerebral';

/**
 * validates the document info form.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateFileAction = ({ applicationContext, get, path }) => {
  const { primaryDocumentFile } = get(state.form);

  const errors = applicationContext.getUseCases().validateFileInteractor({
    primaryDocumentFile,
  });

  if (!errors) {
    return path.success();
  } else {
    // const errorDisplayOrder = [
    //   'supportingDocument',
    //   'supportingDocumentFreeText',
    //   'supportingDocumentFile',
    //   'primaryDocumentFile',
    //   'certificateOfService',
    //   'certificateOfServiceDate',
    //   'attachments',
    //   'objections',
    //   'hasSupportingDocuments',
    //   'supportingDocuments',
    //   'secondaryDocumentFile',
    //   'secondaryDocument',
    //   'hasSecondarySupportingDocuments',
    //   'secondarySupportingDocuments',
    //   'filers',
    //   'partyIrsPractitioner',
    // ];

    // const errorDisplayMap = {
    //   secondarySupportingDocuments: 'Secondary Supporting Document',
    //   supportingDocuments: 'Supporting Document',
    // };

    return path.error({
      alertError: {
        title: 'File is borked.',
      },
      errors,
    });
  }
};
