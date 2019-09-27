import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setFileDocumentValidationAlertErrorsAction } from './setFileDocumentValidationAlertErrorsAction';

describe('setFileDocumentValidationAlertErrors', () => {
  it('creates messages for errors with nested objects in correct order with correct display text', async () => {
    const { state } = await runAction(
      setFileDocumentValidationAlertErrorsAction,
      {
        modules: {
          presenter,
        },
        props: {
          errorDisplayMap: {
            supportingDocuments: 'Supporting Document',
          },
          errorDisplayOrder: [
            'supportingDocument',
            'supportingDocumentFreeText',
            'primaryDocumentFile',
            'certificateOfServiceDate',
            'supportingDocuments',
          ],
          errors: {
            certificateOfServiceDate: 'Enter date of service',
            primaryDocumentFile: 'A file was not selected.',
            supportingDocuments: [
              {
                index: 0,
                supportingDocument: 'Enter selection for Supporting Document.',
              },
              {
                certificateOfServiceDate: 'Enter date of service',
                index: 2,
                supportingDocumentFreeText: 'Please provide a value.',
              },
            ],
          },
        },
        state: {},
      },
    );
    expect(state.alertError).toMatchObject({
      messages: [
        'A file was not selected.',
        'Enter date of service',
        'Supporting Document #1 - Enter selection for Supporting Document.',
        'Supporting Document #3 - Please provide a value.',
        'Supporting Document #3 - Enter date of service',
      ],
    });
  });
});
