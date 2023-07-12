import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the case detail note
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {object} the path success or error depending on validation
 */
export const validateNoteOnCaseDetailAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const note = get(state.modal.notes);

  const errors = applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: { ...caseDetail, caseNote: note },
      useCaseEntity: true,
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
