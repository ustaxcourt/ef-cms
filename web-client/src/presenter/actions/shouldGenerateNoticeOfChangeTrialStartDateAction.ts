import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';
import { state } from '@web-client/presenter/app.cerebral';

export const shouldGenerateNoticeOfChangeTrialStartDateAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const updatedTrialSessionStartDate = get(state.form);
  const currentTrialSessionStartDate = get(state.formattedTrialSessionDetails);

  const shouldGenerateNOT = shouldGenerateNoticeOfChangeTrialStartDate(
    currentTrialSessionStartDate,
    updatedTrialSessionStartDate,
  );

  const { casesThatShouldReceiveNoticesCount } = await applicationContext
    .getUseCases()
    .getTrialSessionOpenCasesCountInteractor(applicationContext, {
      trialSessionId: currentTrialSessionStartDate.trialSessionId,
    });

  if (!shouldGenerateNOT || !casesThatShouldReceiveNoticesCount)
    return path.unchanged();
  console.log('should genereate not');
  return path.both({
    currentTrialSessionStartDate,
    updatedTrialSessionStartDate,
  });
};
