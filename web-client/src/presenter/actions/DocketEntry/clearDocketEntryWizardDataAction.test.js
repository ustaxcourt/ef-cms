import { clearDocketEntryWizardDataAction } from './clearDocketEntryWizardDataAction';
import { runAction } from 'cerebral/test';

describe('clearDocketEntryWizardDataAction', () => {
  it('clear Certificate Of Service date items when certificateOfService is updated', async () => {
    const result = await runAction(clearDocketEntryWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        form: {
          certificateOfServiceDate: '12-12-1212',
          certificateOfServiceDay: 12,
          certificateOfServiceMonth: 12,
          certificateOfServiceYear: 12,
        },
      },
    });
    expect(result.state.form.certificateOfServiceDate).toEqual(null);
    expect(result.state.form.certificateOfServiceDay).toEqual(null);
    expect(result.state.form.certificateOfServiceMonth).toEqual(null);
    expect(result.state.form.certificateOfServiceYear).toEqual(null);
  });
});
