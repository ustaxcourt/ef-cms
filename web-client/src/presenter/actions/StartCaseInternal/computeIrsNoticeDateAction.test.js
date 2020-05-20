import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computeIrsNoticeDateAction } from './computeIrsNoticeDateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computeIrsNoticeDateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set irsNoticeDate to null if state.form is empty', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual(null);
  });

  it('should set irsNoticeDate to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          irsDay: '5',
          irsMonth: '12',
          irsYear: '2012',
        },
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual('2012-12-05T05:00:00.000Z');
  });

  it('should set irsNoticeDate to null if state.form has only month and day', async () => {
    const result = await runAction(computeIrsNoticeDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          irsDay: '5',
          irsMonth: '12',
        },
      },
    });

    expect(result.state.form.irsNoticeDate).toEqual(null);
  });
});
