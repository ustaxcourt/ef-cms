import { clearOptionalFieldsStampFormAction } from '../ApplyStamp/clearOptionalFieldsStampFormAction';
import { runAction } from 'cerebral/test';

describe('clearOptionalFieldsStampFormAction', () => {
  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(clearOptionalFieldsStampFormAction, {
      state: {
        form: {
          dueDateDay: '30',
          dueDateMessage: 'the end is nigh',
          dueDateMonth: '01',
          dueDateYear: '1999',
          jurisdiction: 'as moot',
          strickenCase: true,
        },
      },
    });

    expect(state.form.strickenCase).toBeUndefined();
    expect(state.form.jurisdiction).toBeUndefined();
    expect(state.form.dueDateMessage).toBeUndefined();
    expect(state.form.dueDateDay).toBeUndefined();
    expect(state.form.dueDateMonth).toBeUndefined();
    expect(state.form.dueDateYear).toBeUndefined();
  });
});
