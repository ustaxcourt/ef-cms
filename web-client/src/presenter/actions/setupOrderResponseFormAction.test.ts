import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { setupOrderResponseFormAction } from '@web-client/presenter/actions/setupOrderResponseFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('setupOrderResponseFormAction', () => {
  it('should set issueOrderFor to ALL_CASES and isOnLeadCase to true when the case is the lead case', async () => {
    const result = await runAction(setupOrderResponseFormAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
          leadDocketNumber: '123-45',
        },
      },
    });

    expect(result.state.form.issueOrderFor).toEqual(
      MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
    );
    expect(result.state.form.isOnLeadCase).toBe(true);
  });

  it('should set issueOrderFor to THIS_CASE_ONLY and isOnLeadCase to false when the case is not the lead case', async () => {
    const result = await runAction(setupOrderResponseFormAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
          leadDocketNumber: '678-90',
        },
      },
    });

    expect(result.state.form.issueOrderFor).toEqual(
      MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
    );
    expect(result.state.form.isOnLeadCase).toBe(false);
  });
});
