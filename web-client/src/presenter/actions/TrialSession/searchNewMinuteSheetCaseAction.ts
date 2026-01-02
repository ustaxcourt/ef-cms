import { state } from '@web-client/presenter/app.cerebral';

export const searchNewMinuteSheetCaseAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const docketNumber = get(state.modal.form.docketNumber);
  const trialSessionId = get(state.trialSession.trialSessionId);

  if (!docketNumber || !docketNumber.trim()) {
    return path.error({ errorType: 'noResultsFound' });
  }

  try {
    const result = await applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor(applicationContext, {
        docketNumber: docketNumber.trim(),
        trialSessionId,
      });

    return path.success({ caseInfo: result });
  } catch (error: any) {
    if (error.responseCode === 400) {
      // Case is already on this trial session
      return path.caseAlreadyOnTrialSession({
        errorType: 'caseAlreadyOnTrialSession',
      });
    }
    // Case not found or other error
    return path.error({ errorType: 'noResultsFound' });
  }
};
