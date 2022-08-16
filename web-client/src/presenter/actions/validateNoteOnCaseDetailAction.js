import { state } from 'cerebral';

/**
 * validates the case detail note and sets state.validationErrors when errors occur.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {object} providers.store the cerebral store used for setting the state.validationErrors when validation errors occur
 * @returns {object} the alertSuccess and the generated docketNumber
 */
export const validateNoteOnCaseDetailAction = ({
  applicationContext,
  get,
  path,
}) => {
  const caseDetail = get(state.caseDetail);
  const note = get(state.modal.notes);

  const errors = applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: { ...caseDetail, caseNote: note },
    });

  if (!errors) {
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
