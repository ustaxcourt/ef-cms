import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { clearGrantDenyMotionDependentFieldsAction } from './clearGrantDenyMotionDependentFieldsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearGrantDenyMotionDependentFieldsAction', () => {
  it('should unset dueDate and filingParty when dueDateMessage is cleared', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'dueDateMessage',
        value: null,
      },
      state: {
        form: {
          dueDate: '2026-06-01',
          dueDateMessage:
            GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
          filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
        },
      },
    });

    expect(result.state.form.dueDate).toBeUndefined();
    expect(result.state.form.filingParty).toBeUndefined();
    expect(result.state.form.dueDateMessage).toEqual(
      GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
    );
  });

  it('should not unset dueDate and filingParty when dueDateMessage is set', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'dueDateMessage',
        value: GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
      },
      state: {
        form: {
          dueDate: '2026-06-01',
          filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
        },
      },
    });

    expect(result.state.form.dueDate).toEqual('2026-06-01');
    expect(result.state.form.filingParty).toEqual(
      GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
    );
  });

  it('should not unset form fields when a different key is updated', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'strickenFromTrialSession',
        value: false,
      },
      state: {
        form: {
          dueDate: '2026-06-01',
          filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
        },
      },
    });

    expect(result.state.form.dueDate).toEqual('2026-06-01');
    expect(result.state.form.filingParty).toEqual(
      GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
    );
  });
});
