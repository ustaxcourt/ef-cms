import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

const {
  completeWorkItemInteractor,
  generateSignedDocumentInteractor,
  getInboxMessagesForUserInteractor,
  signDocumentInteractor,
} = applicationContext.getUseCases();
const { uploadDocumentFromClient } = applicationContext.getPersistenceGateway();

applicationContext.getCurrentUser.mockReturnValue({
  userId: '1',
});

describe('completeDocumentSigningAction', () => {
  global.window.pdfjsObj = {
    getData: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
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

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(signDocumentInteractor.mock.calls.length).toBe(1);
    expect(completeWorkItemInteractor.mock.calls.length).toBe(1);
    expect(result.output).toMatchObject({
      alertSuccess: {
        message: 'Your signature has been added',
        title: '',
      },
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
    expect(signDocumentInteractor.mock.calls.length).toBe(0);
    expect(completeWorkItemInteractor.mock.calls.length).toBe(1);
    expect(result.output).toMatchObject({
      alertSuccess: {
        message: 'Your signature has been added',
        title: '',
      },
      caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      tab: 'docketRecord',
    });
  });
});
