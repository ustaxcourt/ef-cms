import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearGrantDenyMotionFormAction } from './clearGrantDenyMotionFormAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearGrantDenyMotionFormAction', () => {
  it('resets all form fields and re-applies lead-case default for issueOrder', async () => {
    const result = await runAction(clearGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26', leadDocketNumber: '101-26' },
        form: {
          disposition: 'GRANTED',
          deniedAsMoot: true,
          additionalOrderText: ['some'],
          jurisdiction: 'retained',
        },
      },
    });

    expect(result.state.form).toEqual({
      additionalOrderText: [''],
      deniedAsMoot: undefined,
      deniedWithoutPrejudice: undefined,
      disposition: undefined,
      dueDate: undefined,
      dueDateMessage: undefined,
      filingParty: undefined,
      isOnLeadCase: true,
      issueOrder:
        GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
      jurisdiction: undefined,
      strickenFromTrialSession: undefined,
    });
  });

  it('leaves issueOrder undefined on a non-lead case', async () => {
    const result = await runAction(clearGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {},
      },
    });

    expect(result.state.form.isOnLeadCase).toBe(false);
    expect(result.state.form.issueOrder).toBeUndefined();
  });
});
