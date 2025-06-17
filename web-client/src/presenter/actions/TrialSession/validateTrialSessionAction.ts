import { state } from '@web-client/presenter/app.cerebral';

export const validateTrialSessionAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const trialSessionForm = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateTrialSessionInteractor(applicationContext, {
      trialSession: trialSessionForm,
    });

  if (!errors) {
    return path.success();
  } else {
    errors.term = undefined;
    errors.termYear = undefined;
    const errorDisplayOrder = [
      'startDate',
      'startTime',
      'estimatedEndDate',
      'swingSessionId',
      'sessionType',
      'maxCases',
      'trialLocation',
      'postalCode',
      'alternateTrialClerkName',
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
