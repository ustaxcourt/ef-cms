import { computeMailingDateAction } from './computeMailingDateAction';
import { runAction } from 'cerebral/test';

describe('computeMailingDateAction', () => {
  it('should set mailingDate to null if state.form is empty', async () => {
    const result = await runAction(computeMailingDateAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.mailingDate).toEqual(null);
  });

  it('should set mailingDate to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeMailingDateAction, {
      state: {
        form: {
          mailingDateDay: '5',
          mailingDateMonth: '12',
          mailingDateYear: '2012',
        },
      },
    });

    expect(result.state.form.mailingDate).toEqual('2012-12-05');
  });

  it('should set mailingDate to undefined-MM-DD if state.form has month and day', async () => {
    const result = await runAction(computeMailingDateAction, {
      state: {
        form: {
          mailingDateDay: '5',
          mailingDateMonth: '12',
        },
      },
    });

    expect(result.state.form.mailingDate).toEqual('undefined-12-05');
  });
});
