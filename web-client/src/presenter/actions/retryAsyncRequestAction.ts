export const retryAsyncRequestAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  let func;
  switch (props.requestToRetry) {
    case 'add_paper_filing':
      func = applicationContext.getUseCases().addPaperFilingInteractor;
      break;
    case 'edit_paper_filing':
      func = applicationContext.getUseCases().editPaperFilingInteractor;
      break;
    case 'file_and_serve_court_issued_document':
      func =
        applicationContext.getUseCases()
          .fileAndServeCourtIssuedDocumentInteractor;
      break;
    case 'set_notices_for_calendared_trial_session':
      func =
        applicationContext.getUseCases()
          .setNoticesForCalendaredTrialSessionInteractor;
      break;
    case 'update_practitioner_user':
      func = applicationContext.getUseCases().updatePractitionerUserInteractor;
      break;
    case 'update_trial_session':
      func = applicationContext.getUseCases().updateTrialSessionInteractor;
      break;
    case 'update_user_contact_information':
      func =
        applicationContext.getUseCases().updateUserContactInformationInteractor;
      break;
    case 'verify_user_pending_email':
      func = applicationContext.getUseCases().verifyUserPendingEmailInteractor;
      break;
    default:
      // what if error?
      break;
  }

  await func(applicationContext, props.originalRequest);
};
