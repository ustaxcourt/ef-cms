import { runAction } from 'cerebral/test';

import presenter from '..';
import setValidationAlertErrors from './setValidationAlertErrorsAction';

describe('setValidationAlertErrors', async () => {
  it('does stuff well', async () => {
    const { state } = await runAction(setValidationAlertErrors, {
      state: {},
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
              index: 5,
              amount: 'An amount must exist',
            },
          ],
        },
      },
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
    const { state } = await runAction(setValidationAlertErrors, {
      state: {},
      modules: {
        presenter,
      },
      props: {
        errors: {
          green: 'green is incorrect',
          blues: { cobalt: 'cobalt is incorrect' },
        },
      },
    });
    expect(state.alertError).toMatchObject({
      messages: ['green is incorrect', 'cobalt is incorrect'],
    });
  });
});
