import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('completeDocumentSigningAction', () => {
  let uploadDocumentStub;
  let generateSignedDocumentInteractorStub;
  let signDocumentInteractorStub;
  let getInboxMessagesForUserInteractorStub;
  let completeWorkItemInteractorStub;

  beforeEach(() => {
    global.window = {
      pdfjsObj: {
        getData: sinon.stub(),
      },
    };

    global.File = sinon.stub();

    uploadDocumentStub = sinon.stub();
    generateSignedDocumentInteractorStub = sinon.stub();
    signDocumentInteractorStub = sinon.stub();
    getInboxMessagesForUserInteractorStub = sinon.stub().returns([
      {
        document: {
          documentType: 'Proposed Stipulated Decision',
        },
        workItemId: '1',
      },
    ]);
    completeWorkItemInteractorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getCurrentUser: () => ({ userId: '1' }),
      getPersistenceGateway: () => ({
        uploadDocument: uploadDocumentStub,
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
    sinon.restore();
  });

  it('should sign a document via executing various use cases', async () => {
    await runAction(completeDocumentSigningAction, {
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
        messageId: '123',
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

    expect(uploadDocumentStub.calledOnce).toEqual(true);
    expect(generateSignedDocumentInteractorStub.calledOnce).toEqual(true);
    expect(signDocumentInteractorStub.calledOnce).toEqual(true);
    expect(completeWorkItemInteractorStub.calledOnce).toEqual(true);
  });
});
