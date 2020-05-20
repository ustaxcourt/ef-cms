import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computeReceivedAtDateAction } from './computeReceivedAtDateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computeReceivedAtDateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set receivedAt to null if state.form is empty', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.receivedAt).toEqual(null);
  });

  it('should set receivedAt to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          receivedAtDay: '5',
          receivedAtMonth: '12',
          receivedAtYear: '2012',
        },
      },
    });

    expect(result.state.form.receivedAt).toEqual('2012-12-05T05:00:00.000Z');
  });

  it('should set receivedAt to null if state.form has only month and day', async () => {
    const result = await runAction(computeReceivedAtDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          receivedAtDay: '5',
          receivedAtMonth: '12',
        },
      },
    });

    expect(result.state.form.receivedAt).toEqual(null);
  });
});
