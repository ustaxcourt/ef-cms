import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeDocumentSigningAction', () => {
  const {
    generateSignedDocumentInteractor,
    getInboxMessagesForUserInteractor,
  } = applicationContext.getUseCases();
  const {
    uploadDocumentFromClient,
  } = applicationContext.getPersistenceGateway();

  const docketNumber = '123';

  const mockDocumentId = applicationContext.getUniqueId();

  applicationContext
    .getUseCases()
    .saveSignedDocumentInteractor.mockReturnValue({
      signedDocumentId: mockDocumentId,
    });

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
          docketEntries: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber,
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
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(1);
    expect(result.output).toMatchObject({
      docketNumber,
      redirectUrl: `/case-detail/${docketNumber}/draft-documents?documentId=${mockDocumentId}`,
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
          docketEntries: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber,
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
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(0);
    expect(result.output).toMatchObject({
      docketNumber,
      tab: 'docketRecord',
    });
  });

  it('should construct a redirectUrl to the message detail document view if there is a parentMessageId present in state', async () => {
    const parentMessageId = applicationContext.getUniqueId();

    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber,
        },
        currentViewMetadata: {
          messageId: '123',
        },
        parentMessageId,
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

    expect(result.output).toMatchObject({
      redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${mockDocumentId}`,
    });
  });

  it('should construct a redirectUrl to the draft documents view if there is no parentMessageId present in state', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber,
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

    expect(result.output).toMatchObject({
      redirectUrl: `/case-detail/${docketNumber}/draft-documents?documentId=${mockDocumentId}`,
    });
  });
});
