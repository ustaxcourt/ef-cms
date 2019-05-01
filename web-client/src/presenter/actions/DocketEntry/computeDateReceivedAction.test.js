import { computeDateReceivedAction } from './computeDateReceivedAction';
import { runAction } from 'cerebral/test';

describe('computeDateReceivedAction', () => {
  it('should set dateReceived to null if state.form is empty', async () => {
    const result = await runAction(computeDateReceivedAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.dateReceived).toEqual(null);
  });

  it('should set dateReceived to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeDateReceivedAction, {
      state: {
        form: {
          dateReceivedDay: '5',
          dateReceivedMonth: '12',
          dateReceivedYear: '2012',
        },
      },
    });

    expect(result.state.form.dateReceived).toEqual('2012-12-05');
  });

  it('should set dateReceived to undefined-MM-DD if state.form has month and day', async () => {
    const result = await runAction(computeDateReceivedAction, {
      state: {
        form: {
          dateReceivedDay: '5',
          dateReceivedMonth: '12',
        },
      },
    });

    expect(result.state.form.dateReceived).toEqual('undefined-12-05');
  });
});
