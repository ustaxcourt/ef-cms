import { computeIrsNoticeDateAction } from './computeIrsNoticeDateAction';
import { runAction } from 'cerebral/test';

describe('computeIrsNoticeDateAction', () => {
  it('should set irsNoticeDate to null if state.form is empty', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual(null);
  });

  it('should set irsNoticeDate to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      state: {
        form: {
          irsDay: '5',
          irsMonth: '12',
          irsYear: '2012',
        },
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual('2012-12-05');
  });

  it('should set irsNoticeDate to undefined-MM-DD if state.form has month and day', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      state: {
        form: {
          irsDay: '5',
          irsMonth: '12',
        },
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual('undefined-12-05');
  });
});
