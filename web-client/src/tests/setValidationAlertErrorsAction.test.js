import { runAction } from 'cerebral/test';

import presenter from '../presenter';
import setValidationAlertErrors from '../presenter/actions/setValidationAlertErrorsAction';

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
        'entry #1 - A year can not be in the future',
        'entry #6 - An amount must exist',
      ],
    });
  });
});
