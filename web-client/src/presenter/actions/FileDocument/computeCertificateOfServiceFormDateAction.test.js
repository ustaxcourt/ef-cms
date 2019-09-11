import { computeCertificateOfServiceFormDateAction } from './computeCertificateOfServiceFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeCertificateOfServiceFormDateAction', () => {
  it('should set certificateOfServiceDate to null if state.form is empty', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.certificateOfServiceDate).toBeNull();
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

  it('should set certificateOfServiceDate for secondary and supporting documents', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      state: {
        form: {
          certificateOfServiceDay: '5',
          certificateOfServiceMonth: '12',
          certificateOfServiceYear: '2012',
          secondaryDocument: {
            certificateOfServiceDay: '6',
            certificateOfServiceMonth: '11',
            certificateOfServiceYear: '2012',
          },
          secondarySupportingDocuments: [
            {
              certificateOfServiceDay: '8',
              certificateOfServiceMonth: '9',
              certificateOfServiceYear: '2012',
            },
          ],
          supportingDocuments: [
            {
              certificateOfServiceDay: '7',
              certificateOfServiceMonth: '10',
              certificateOfServiceYear: '2012',
            },
          ],
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual('2012-12-05');
    expect(
      result.state.form.secondaryDocument.certificateOfServiceDate,
    ).toEqual('2012-11-06');
    expect(
      result.state.form.supportingDocuments[0].certificateOfServiceDate,
    ).toEqual('2012-10-07');
    expect(
      result.state.form.secondarySupportingDocuments[0]
        .certificateOfServiceDate,
    ).toEqual('2012-09-08');
  });
});
