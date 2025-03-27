import { caseIsEligibleForMinuteSheet } from '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet';
import { state } from '@web-client/presenter/app.cerebral';

export const isEligibleForMinuteSheetAction = ({ get, path }) => {
  const aCase = get(state.caseDetail);
  const trialSession = get(state.trialSession);

  const isEligibleForMinuteSheet = caseIsEligibleForMinuteSheet(
    {
      ...trialSession.caseOrder.find(
        caseOrder => caseOrder.docketNumber === aCase.docketNumber,
      ),
      ...aCase,
    },
    trialSession,
  );

  return isEligibleForMinuteSheet ? path.yes() : path.no();
};
