import { runAction } from 'cerebral/test';

import presenter from '..';
import setValidationAlertErrors from './setValidationAlertErrorsAction';

describe('setValidationAlertErrors', async () => {
  it('state.alertError contains 3 errors, one from the irsNoticeDate error, and two from the yearAmounts array', async () => {
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
});
