import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';
import { state } from '@web-client/presenter/app.cerebral';

export const determineNoticesOfTrialChangesToGenerateAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const updatedTrialSession = get(state.form);
  const currentTrialSession = get(state.formattedTrialSessionDetails);

  const shouldGenerateNCTL = shouldGenerateNoticeOfChangeTrialLocation(
    currentTrialSession,
    updatedTrialSession,
  );

  const shouldGenerateNCTD = shouldGenerateNoticeOfChangeTrialStartDate(
    currentTrialSession,
    updatedTrialSession,
  );

  const { casesThatShouldReceiveNoticesCount } = await applicationContext
    .getUseCases()
    .getTrialSessionOpenCasesCountInteractor(applicationContext, {
      trialSessionId: currentTrialSession.trialSessionId,
    });

  if (casesThatShouldReceiveNoticesCount) {
    if (shouldGenerateNCTL && shouldGenerateNCTD) {
      return path.both({
        currentTrialSession,
        updatedTrialSession,
        persistModal: true,
      });
    } else if (shouldGenerateNCTL && !shouldGenerateNCTD) {
      return path.location({
        currentTrialSession,
        updatedTrialSession,
        persistModal: false,
      });
    } else if (!shouldGenerateNCTL && shouldGenerateNCTD) {
      return path.startDate({
        currentTrialSession,
        updatedTrialSession,
        persistModal: false,
      });
    }
  }
  return path.unchanged();
};
