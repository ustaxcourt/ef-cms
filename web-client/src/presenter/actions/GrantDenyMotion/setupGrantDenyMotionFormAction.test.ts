import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupGrantDenyMotionFormAction } from './setupGrantDenyMotionFormAction';

describe('setupGrantDenyMotionFormAction', () => {
  it('initializes additionalOrderText as an empty array on a non-lead case', async () => {
    const result = await runAction(setupGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {},
      },
    });

    expect(result.state.form.additionalOrderText).toEqual(['']);
    expect(result.state.form.isOnLeadCase).toBe(false);
    expect(result.state.form.issueOrder).toBeUndefined();
  });

  it('defaults issueOrder to allCasesInGroup when on a lead case', async () => {
    const result = await runAction(setupGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '101-26',
          leadDocketNumber: '101-26',
        },
        form: {},
      },
    });

    expect(result.state.form.isOnLeadCase).toBe(true);
    expect(result.state.form.issueOrder).toEqual(
      GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
    );
  });
});
