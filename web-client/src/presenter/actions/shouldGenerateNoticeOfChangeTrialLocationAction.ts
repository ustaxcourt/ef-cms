import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { state } from '@web-client/presenter/app.cerebral';

export const shouldGenerateNoticeOfChangeTrialLocationAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const updatedTrialSessionLocation = get(state.form);
  const currentTrialSessionLocation = get(state.formattedTrialSessionDetails);

  const shouldGenerateNCTL = shouldGenerateNoticeOfChangeTrialLocation(
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  );

  const { casesThatShouldReceiveNoticesCount } = await applicationContext
    .getUseCases()
    .getTrialSessionOpenCasesCountInteractor(applicationContext, {
      trialSessionId: currentTrialSessionLocation.trialSessionId,
    });

  if (!shouldGenerateNCTL || !casesThatShouldReceiveNoticesCount)
    return path.unchanged();

  return path.updated({
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  });
};
