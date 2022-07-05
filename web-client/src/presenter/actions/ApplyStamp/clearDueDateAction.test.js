import { clearDueDateAction } from './clearDueDateAction';
import { runAction } from 'cerebral/test';

describe('clearDueDateAction', () => {
  it('should unset the stip decision due date on the form', async () => {
    const { state } = await runAction(clearDueDateAction, {
      state: {
        form: {
          'dueDateDay-stipDecision': '30',
          'dueDateMonth-stipDecision': '06',
          'dueDateYear-stipDecision': '1998',
        },
      },
    });

    expect(state.form['dueDateDay-stipDecision']).toBeUndefined();
    expect(state.form['dueDateMonth-stipDecision']).toBeUndefined();
    expect(state.form['dueDateYear-stipDecision']).toBeUndefined();
  });

  it('should unset the status report due date on the form', async () => {
    const { state } = await runAction(clearDueDateAction, {
      state: {
        form: {
          'dueDateDay-statusReport': '30',
          'dueDateMonth-statusReport': '06',
          'dueDateYear-statusReport': '1998',
        },
      },
    });

    expect(state.form['dueDateDay-statusReport']).toBeUndefined();
    expect(state.form['dueDateMonth-statusReport']).toBeUndefined();
    expect(state.form['dueDateYear-statusReport']).toBeUndefined();
  });
});
