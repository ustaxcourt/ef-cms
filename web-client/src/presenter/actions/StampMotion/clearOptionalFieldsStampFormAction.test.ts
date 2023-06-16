import { clearOptionalFieldsStampFormAction } from '../StampMotion/clearOptionalFieldsStampFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearOptionalFieldsStampFormAction', () => {
  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(clearOptionalFieldsStampFormAction, {
      state: {
        form: {
          customText: 'bam',
          day: '30',
          dueDateMessage: 'the end is nigh',
          jurisdictionalOption: 'as moot',
          month: '30',
          strickenFromTrialSession: true,
          year: '1999',
        },
      },
    });

    expect(state.form.strickenFromTrialSession).toBeUndefined();
    expect(state.form.jurisdictionalOption).toBeUndefined();

    expect(state.form.dueDateMessage).toBeUndefined();
    expect(state.form['day']).toBeUndefined();
    expect(state.form['month']).toBeUndefined();
    expect(state.form['year']).toBeUndefined();

    expect(state.form.customText).toEqual('');
  });
});
