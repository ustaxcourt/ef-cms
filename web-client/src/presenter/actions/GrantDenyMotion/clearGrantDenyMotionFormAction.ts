import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const clearGrantDenyMotionFormAction = ({
  get,
  store,
}: ActionProps) => {
  const isOnLeadCase = isLeadCase(get(state.caseDetail));

  store.set(state.form, {
    additionalOrderText: [''],
    deniedAsMoot: undefined,
    deniedWithoutPrejudice: undefined,
    disposition: undefined,
    dueDate: undefined,
    dueDateMessage: undefined,
    filingParty: undefined,
    isOnLeadCase,
    issueOrder: isOnLeadCase
      ? GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup
      : undefined,
    jurisdiction: undefined,
    strickenFromTrialSession: undefined,
  });
};
