import { getMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/getMinuteSheetProxy';

export const checkForExistingMinuteSheetAction = async ({ path, props }) => {
  const { caseDetail, trialSession } = props;

  const minuteSheet = await getMinuteSheetInteractor({
    docketNumber: caseDetail.docketNumber,
    trialSessionId: trialSession.trialSessionId,
  });

  const isExistingMinuteSheet = !!minuteSheet;

  if (isExistingMinuteSheet) {
    return path.yes({ minuteSheet });
  }

  return path.no();
};
