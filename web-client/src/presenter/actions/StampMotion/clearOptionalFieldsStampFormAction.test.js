import { clearOptionalFieldsStampFormAction } from '../StampMotion/clearOptionalFieldsStampFormAction';
import { runAction } from 'cerebral/test';

describe('clearOptionalFieldsStampFormAction', () => {
  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(clearOptionalFieldsStampFormAction, {
      state: {
        form: {
          'dueDateDay-statusReport': '30',
          'dueDateDay-stipDecision': '30',
          dueDateMessage: 'the end is nigh',
          'dueDateMonth-statusReport': '01',
          'dueDateMonth-stipDecision': '01',
          'dueDateYear-statusReport': '1999',
          'dueDateYear-stipDecision': '1999',
          jurisdictionalOption: 'as moot',
          strickenFromTrialSession: true,
        },
      },
    });

    expect(state.form.strickenFromTrialSession).toBeUndefined();
    expect(state.form.jurisdictionalOption).toBeUndefined();

    expect(state.form.dueDateMessage).toBeUndefined();
    expect(state.form['dueDateDay-stipDecision']).toBeUndefined();
    expect(state.form['dueDateMonth-stipDecision']).toBeUndefined();
    expect(state.form['dueDateYear-stipDecision']).toBeUndefined();

    expect(state.form['dueDateDay-statusReport']).toBeUndefined();
    expect(state.form['dueDateMonth-statusReport']).toBeUndefined();
    expect(state.form['dueDateYear-statusReport']).toBeUndefined();
  });
});
