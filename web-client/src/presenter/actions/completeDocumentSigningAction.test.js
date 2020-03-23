import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('completeDocumentSigningAction', () => {
  let uploadDocumentStub;
  let generateSignedDocumentInteractorStub;
  let signDocumentInteractorStub;
  let getInboxMessagesForUserInteractorStub;
  let completeWorkItemInteractorStub;

  global.window.pdfjsObj = {
    getData: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    global.File = jest.fn();

    uploadDocumentStub = jest
      .fn()
      .mockReturnValue('abc81f4d-1e47-423a-8caf-6d2fdc3d3859');
    generateSignedDocumentInteractorStub = jest.fn();
    signDocumentInteractorStub = jest.fn();
    getInboxMessagesForUserInteractorStub = jest.fn().mockReturnValue([
      {
        document: {
          documentType: 'Proposed Stipulated Decision',
        },
        workItemId: '1',
      },
    ]);
    completeWorkItemInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getCurrentUser: () => ({ userId: '1' }),
      getPersistenceGateway: () => ({
        uploadDocumentFromClient: uploadDocumentStub,
      }),
      getUseCases: () => ({
        completeWorkItemInteractor: completeWorkItemInteractorStub,
        generateSignedDocumentInteractor: generateSignedDocumentInteractorStub,
        getInboxMessagesForUserInteractor: getInboxMessagesForUserInteractorStub,
        signDocumentInteractor: signDocumentInteractorStub,
      }),
    };
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

    expect(uploadDocumentStub.mock.calls.length).toBe(1);
    expect(generateSignedDocumentInteractorStub.mock.calls.length).toBe(1);
    expect(signDocumentInteractorStub.mock.calls.length).toBe(1);
    expect(completeWorkItemInteractorStub.mock.calls.length).toBe(1);
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

    expect(uploadDocumentStub.mock.calls.length).toBe(0);
    expect(generateSignedDocumentInteractorStub.mock.calls.length).toBe(0);
    expect(signDocumentInteractorStub.mock.calls.length).toBe(0);
    expect(completeWorkItemInteractorStub.mock.calls.length).toBe(1);
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
