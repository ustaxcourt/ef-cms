import {
  caseIsEligibleForMinuteSheet,
  isEligibleUnscheduledCaseForMinuteSheet,
} from '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet';
import { state } from '@web-client/presenter/app.cerebral';

export const isEligibleForMinuteSheetAction = ({ get, path, store }) => {
  const aCase = get(state.caseDetail);
  const trialSession = get(state.trialSession);

  // Check if case is in the trial session's caseOrder (scheduled case)
  const caseOrderEntry = trialSession.caseOrder?.find(
    caseOrder => caseOrder.docketNumber === aCase.docketNumber,
  );

  const isScheduledCase = !!caseOrderEntry;

  if (isScheduledCase) {
    // For scheduled cases, use existing logic
    const isEligibleForMinuteSheet = caseIsEligibleForMinuteSheet(
      {
        ...caseOrderEntry,
        ...aCase,
      },
      trialSession,
    );

    if (isEligibleForMinuteSheet) {
      store.set(state.isUnscheduledMinuteSheet, false);
      return path.yes();
    }
    return path.no();
  }

  // For unscheduled cases, check eligibility without caseOrder-specific checks
  const isEligibleUnscheduledCase = isEligibleUnscheduledCaseForMinuteSheet(
    aCase,
    trialSession,
  );

  if (isEligibleUnscheduledCase) {
    store.set(state.isUnscheduledMinuteSheet, true);
    return path.yes();
  }

  return path.no();
};
