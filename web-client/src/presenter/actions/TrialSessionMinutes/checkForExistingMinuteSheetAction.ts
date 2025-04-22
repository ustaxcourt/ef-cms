import { getMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/getMinuteSheetProxy';
import { isEmpty } from 'lodash';

export const checkForExistingMinuteSheetAction = async ({ path, props }) => {
  const { caseDetail, trialSession } = props;

  const minuteSheet = await getMinuteSheetInteractor({
    docketNumber: caseDetail.docketNumber,
    trialSessionId: trialSession.trialSessionId,
  });

  const isExistingMinuteSheet = !isEmpty(minuteSheet);

  if (isExistingMinuteSheet) {
    return path.yes({ minuteSheet });
  }

  return path.no();
};
