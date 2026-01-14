import {
  caseIsEligibleForMinuteSheet,
  isEligibleUnscheduledCaseForMinuteSheet,
} from '@shared/business/utilities/trialSessionMinutes/caseIsEligibleForMinuteSheet';
import { state } from '@web-client/presenter/app.cerebral';

export const isEligibleForMinuteSheetAction = ({
  get,
  path,
  store,
}) => {
  const aCase = get(state.caseDetail);
  const trialSession = get(state.trialSession);

  const caseOrderEntry = trialSession.caseOrder?.find(
    caseOrder => caseOrder.docketNumber === aCase.docketNumber,
  );

  // Case is in caseOrder and is active (not removed) - use scheduled case eligibility
  const isActiveScheduledCase =
    !!caseOrderEntry && caseOrderEntry.removedFromTrial !== true;

  if (isActiveScheduledCase) {
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

  // Case is either:
  // 1. In caseOrder but removed (inactive) - accessed via modal with isUnscheduledCase=true
  // 2. Not in caseOrder at all (truly unscheduled)
  // For both cases, use the unscheduled eligibility check
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
