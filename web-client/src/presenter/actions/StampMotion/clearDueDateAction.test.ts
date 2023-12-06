import { clearDueDateAction } from './clearDueDateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDueDateAction', () => {
  it('should unset the due date on the form', async () => {
    const { state } = await runAction(clearDueDateAction, {
      state: {
        form: {
          day: '30',
          month: '06',
          year: '1998',
        },
      },
    });

    expect(state.form['day']).toBeUndefined();
    expect(state.form['month']).toBeUndefined();
    expect(state.form['year']).toBeUndefined();
  });
});
