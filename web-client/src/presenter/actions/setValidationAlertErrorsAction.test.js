import { runAction } from 'cerebral/test';

import presenter from '..';
import { setValidationAlertErrorsAction } from './setValidationAlertErrorsAction';

describe('setValidationAlertErrors', async () => {
  it('state.alertError contains 3 errors, one from the irsNoticeDate error, and two from the yearAmounts array', async () => {
    const { state } = await runAction(setValidationAlertErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          irsNoticeDate: 'Some issue occurred',
          yearAmounts: [
            {
              index: 0,
              year: 'A year can not be in the future',
            },
            {
              amount: 'An amount must exist',
              index: 5,
            },
          ],
        },
      },
      state: {},
    });
    expect(state.alertError).toMatchObject({
      messages: [
        'Some issue occurred',
        'yearAmounts #1 - year field - A year can not be in the future',
        'yearAmounts #6 - amount field - An amount must exist',
      ],
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
      messages: ['green is incorrect', 'cobalt is incorrect'],
    });
  });
});
