import { clearCaseAssociationWizardDataAction } from './clearCaseAssociationWizardDataAction';
import { runAction } from 'cerebral/test';

describe('clearCaseAssociationWizardDataAction', () => {
  it('clears certificateOfService', async () => {
    const result = await runAction(clearCaseAssociationWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        form: {
          certificateOfServiceDate: new Date(),
          certificateOfServiceDay: 23,
          certificateOfServiceMonth: 4,
          certificateOfServiceYear: 2020,
        },
      },
    });

    expect(result.state.form).toEqual({
      certificateOfServiceDate: null,
      certificateOfServiceDay: null,
      certificateOfServiceMonth: null,
      certificateOfServiceYear: null,
    });
  });
  it('clears objections', async () => {
    const result = await runAction(clearCaseAssociationWizardDataAction, {
      props: {
        key: 'documentType',
      },
      state: {
        form: {
          objections: ['objection 1', 'objection 2'],
        },
      },
    });

    expect(result.state.form.objections).toEqual(null);
  });
});
