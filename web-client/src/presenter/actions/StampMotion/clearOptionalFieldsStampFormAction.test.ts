import { clearOptionalFieldsStampFormAction } from '../StampMotion/clearOptionalFieldsStampFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearOptionalFieldsStampFormAction', () => {
  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(clearOptionalFieldsStampFormAction, {
      state: {
        form: {
          customText: 'bam',
          date: '11/30/2023',
          dueDateMessage: 'the end is nigh',
          jurisdictionalOption: 'as moot',
          strickenFromTrialSession: true,
        },
      },
    });

    expect(state.form.strickenFromTrialSession).toBeUndefined();
    expect(state.form.jurisdictionalOption).toBeUndefined();
    expect(state.form.dueDateMessage).toBeUndefined();
    expect(state.form.date).toBeUndefined();
    expect(state.form.customText).toEqual('');
  });
});
