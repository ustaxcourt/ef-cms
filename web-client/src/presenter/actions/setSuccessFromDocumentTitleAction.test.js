import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSuccessFromDocumentTitleAction } from './setSuccessFromDocumentTitleAction';

describe('setSuccessFromDocumentTitleAction,', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets the success message from the documentTitle when the document eventCode is not PSDE', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order',
              eventCode: 'O',
            },
          ],
        },
        documentId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('sets the success message from the documentType if documentTitle is not present and the eventCode is not PSDE', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
        documentId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('sets the created document success message if state.isCreatingOrder is true', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Order',
            },
          ],
        },
        documentId: 'abc',
        isCreatingOrder: true,
      },
    });

    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });

  it('should set the success message when the signed document eventCode is PSDE', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Proposed Stipulated Decision',
              eventCode: 'PSDE',
            },
          ],
        },
        documentId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual(
      'Stipulated Decision signed and saved.',
    );
  });
});
