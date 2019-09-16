import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setValidationAlertErrorsAction } from './setValidationAlertErrorsAction';

describe('setValidationAlertErrors', () => {
  it('state.alertError contains the irsNoticeDate error', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          irsNoticeDate: 'Some issue occurred',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['Some issue occurred'],
    });
  });

  it('creates messages for errors with nested objects', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          blues: { cobalt: 'cobalt is incorrect' },
          green: 'green is incorrect',
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: ['cobalt is incorrect', 'green is incorrect'],
    });
  });
});
