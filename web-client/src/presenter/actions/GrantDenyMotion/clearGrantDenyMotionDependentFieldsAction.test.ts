import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
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

  it('should unset jurisdiction when strickenFromTrialSession is unchecked', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'strickenFromTrialSession',
        value: false,
      },
      state: {
        form: {
          jurisdiction: GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
          strickenFromTrialSession: true,
        },
      },
    });

    expect(result.state.form.jurisdiction).toBeUndefined();
    expect(result.state.form.strickenFromTrialSession).toEqual(true);
  });

  it('should unset deniedAsMoot and deniedWithoutPrejudice when disposition is not DENIED', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'disposition',
        value: MOTION_DISPOSITIONS.GRANTED,
      },
      state: {
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
          disposition: MOTION_DISPOSITIONS.DENIED,
        },
      },
    });

    expect(result.state.form.deniedAsMoot).toBeUndefined();
    expect(result.state.form.deniedWithoutPrejudice).toBeUndefined();
    expect(result.state.form.disposition).toEqual(MOTION_DISPOSITIONS.DENIED);
  });

  it('should not unset deniedAsMoot and deniedWithoutPrejudice when disposition is DENIED', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'disposition',
        value: MOTION_DISPOSITIONS.DENIED,
      },
      state: {
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
        },
      },
    });

    expect(result.state.form.deniedAsMoot).toEqual(true);
    expect(result.state.form.deniedWithoutPrejudice).toEqual(true);
  });

  it('should not unset form fields when an unrelated key is updated', async () => {
    const result = await runAction(clearGrantDenyMotionDependentFieldsAction, {
      props: {
        key: 'dueDate',
        value: '2026-06-02',
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
