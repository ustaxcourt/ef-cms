import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const setupGrantDenyMotionFormAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const isOnLeadCase = isLeadCase(caseDetail);

  store.set(state.form, {
    additionalOrderText: [''],
    isOnLeadCase,
    issueOrder: isOnLeadCase
      ? GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup
      : undefined,
  });
};
