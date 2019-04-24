import { computeCertificateOfServiceFormDateAction } from './computeCertificateOfServiceFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeCertificateOfServiceFormDateAction', () => {
  it('should set certificateOfServiceDate to undefined if state.form is empty', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
  });

  it('should set certificateOfServiceDate to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      state: {
        form: {
          certificateOfServiceDay: '5',
          certificateOfServiceMonth: '12',
          certificateOfServiceYear: '2012',
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual('2012-12-05');
  });

  it('should set certificateOfServiceDate to undefined-MM-DD if state.form has month and day', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      state: {
        form: {
          certificateOfServiceDay: '5',
          certificateOfServiceMonth: '12',
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual(
      'undefined-12-05',
    );
  });
});
