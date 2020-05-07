import { computeReceivedAtDateAction } from './computeReceivedAtDateAction';
import { runAction } from 'cerebral/test';

describe('computeReceivedAtDateAction', () => {
  it('should set receivedAt to null if state.form is empty', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.receivedAt).toEqual(null);
  });

  it('should set receivedAt to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      state: {
        form: {
          receivedAtDay: '5',
          receivedAtMonth: '12',
          receivedAtYear: '2012',
        },
      },
    });

    expect(result.state.form.receivedAt).toEqual('2012-12-05');
  });

  it('should set receivedAt to undefined-MM-DD if state.form has month and day', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      state: {
        form: {
          receivedAtDay: '5',
          receivedAtMonth: '12',
        },
      },
    });

    expect(result.state.form.receivedAt).toEqual('undefined-12-05');
  });
});
