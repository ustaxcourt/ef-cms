import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computeCertificateOfServiceFormDateAction } from './computeCertificateOfServiceFormDateAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('computeCertificateOfServiceFormDateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set certificateOfServiceDate to undefined if state.form is empty', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.certificateOfServiceDate).toBeUndefined();
  });

  it('should set certificateOfServiceDate to YYYY-MM-DD if state.form has year, month, and day', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          certificateOfServiceDay: '5',
          certificateOfServiceMonth: '12',
          certificateOfServiceYear: '2012',
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual(
      '2012-12-05T05:00:00.000Z',
    );
  });

  it('should set certificateOfServiceDate to undefined if state.form has year, month, or day', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          certificateOfServiceDay: '5',
          certificateOfServiceMonth: '12',
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
  });

  it('should set certificateOfServiceDate for secondary and supporting documents', async () => {
    const result = await runAction(computeCertificateOfServiceFormDateAction, {
      modules: {
        presenter,
      },
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

    expect(result.state.form.certificateOfServiceDate).toEqual(
      '2012-12-05T05:00:00.000Z',
    );
    expect(
      result.state.form.secondaryDocument.certificateOfServiceDate,
    ).toEqual('2012-11-06T05:00:00.000Z');
    expect(
      result.state.form.supportingDocuments[0].certificateOfServiceDate,
    ).toEqual('2012-10-07T04:00:00.000Z');
    expect(
      result.state.form.secondarySupportingDocuments[0]
        .certificateOfServiceDate,
    ).toEqual('2012-09-08T04:00:00.000Z');
  });
});
