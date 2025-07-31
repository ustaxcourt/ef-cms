import { saveMinuteSheetToDraftsInteractor } from '@shared/proxies/trialSessionMinutes/saveMinuteSheetToDraftsProxy';
import { state } from '@web-client/presenter/app.cerebral';

export const saveMinuteSheetToDraftsAction = async ({ get, path }) => {
  const { docketNumber } = get(state.caseDetail);
  const { trialSessionId } = get(state.trialSession);

  try {
    await saveMinuteSheetToDraftsInteractor({
      docketNumber,
      trialSessionId,
    });
    return path.success({
      alertSuccess: {
        message: 'Minutes PDF saved to case Drafts.',
      },
    });
  } catch (error) {
    return path.error({
      alertError: {
        message: 'Minutes PDF failed to save to case Drafts.',
      },
    });
  }
};
