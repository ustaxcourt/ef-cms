import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeDocumentSigningAction', () => {
  const {
    generateSignedDocumentInteractor,
    getInboxMessagesForUserInteractor,
    saveSignedDocumentInteractor,
  } = applicationContext.getUseCases();
  const {
    uploadDocumentFromClient,
  } = applicationContext.getPersistenceGateway();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getCurrentUser.mockReturnValue({
      userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    });

    global.window = {
      pdfjsObj: {
        getData: jest.fn().mockResolvedValue(true),
      },
    };

    global.window.pdfjsObj = {
      getData: jest.fn().mockResolvedValue(true),
    };

    global.File = jest.fn();

    uploadDocumentFromClient.mockReturnValue(
      'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
    getInboxMessagesForUserInteractor.mockReturnValue([
      {
        document: {
          documentType: 'Proposed Stipulated Decision',
        },
        workItemId: '1',
      },
    ]);
  });

  it('should sign a document via executing various use cases', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documents: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: [
                {
                  messages: [
                    {
                      messageId: '123',
                    },
                  ],
                },
              ],
            },
          ],
        },
        currentViewMetadata: {
          messageId: '123',
        },
        pdfForSigning: {
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
          signatureData: {
            scale: 1,
            x: 300,
            y: 400,
          },
        },
      },
    });

    expect(uploadDocumentFromClient.mock.calls.length).toBe(1);
    expect(generateSignedDocumentInteractor.mock.calls.length).toBe(1);
    expect(saveSignedDocumentInteractor.mock.calls.length).toBe(1);
    expect(result.output).toMatchObject({
      caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      tab: 'docketRecord',
    });
  });

  it('should NOT sign a document without signature data', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documents: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: [
                {
                  messages: [
                    {
                      messageId: '123',
                    },
                  ],
                },
              ],
            },
          ],
        },
        currentViewMetadata: {
          messageId: '123',
        },
        pdfForSigning: {
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
        },
      },
    });

    expect(uploadDocumentFromClient.mock.calls.length).toBe(0);
    expect(generateSignedDocumentInteractor.mock.calls.length).toBe(0);
    expect(saveSignedDocumentInteractor.mock.calls.length).toBe(0);
    expect(result.output).toMatchObject({
      caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      tab: 'docketRecord',
    });
  });
});
