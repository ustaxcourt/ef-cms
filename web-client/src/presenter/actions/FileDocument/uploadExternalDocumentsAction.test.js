import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';
import sinon from 'sinon';

describe('uploadExternalDocumentsAction', () => {
  let uploadExternalDocumentsInteractorStub;
  let addCoversheetInteractorStub;

  beforeEach(() => {
    uploadExternalDocumentsInteractorStub = sinon.stub();
    addCoversheetInteractorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorStub,
        uploadExternalDocumentsInteractor: uploadExternalDocumentsInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: () => null,
      success: () => null,
    };
  });

  it('should call uploadExternalDocumentsInteractor for a single document file and call addCoversheetInteractorStub for the pending document', async () => {
    uploadExternalDocumentsInteractorStub.returns({
      ...MOCK_CASE,
      documents: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          processingStatus: 'pending',
          userId: 'petitioner',
          workItems: [],
        },
      ],
    });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          primaryDocumentFile: { data: 'something' },
        },
      },
    });

    expect(uploadExternalDocumentsInteractorStub.calledOnce).toEqual(true);
    expect(
      uploadExternalDocumentsInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      documentFiles: { primary: { data: 'something' } },
      documentMetadata: {
        attachments: true,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    });
    expect(addCoversheetInteractorStub.calledOnce).toEqual(true);
    expect(addCoversheetInteractorStub.getCall(0).args[0]).toMatchObject({
      caseId: MOCK_CASE.caseId,
      documentId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  it('should call uploadExternalDocumentsInteractor for a primary and secondary document with multiple supporting documents', async () => {
    uploadExternalDocumentsInteractorStub.returns(MOCK_CASE);

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          hasSecondarySupportingDocuments: true,
          hasSupportingDocuments: true,
          primaryDocumentFile: { data: 'something' },
          secondaryDocumentFile: { data: 'something2' },
          secondarySupportingDocuments: [
            {
              supportingDocumentFile: { data: 'something5' },
            },
            {
              supportingDocumentFile: { data: 'something6' },
            },
          ],
          supportingDocuments: [
            {
              supportingDocumentFile: { data: 'something3' },
              supportingDocumentFreeText: 'abc',
            },
            {
              attachments: true,
              supportingDocumentFile: { data: 'something4' },
            },
          ],
        },
      },
    });

    expect(uploadExternalDocumentsInteractorStub.calledOnce).toEqual(true);
    expect(
      uploadExternalDocumentsInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      documentFiles: {
        primary: { data: 'something' },
        primarySupporting0: { data: 'something3' },
        primarySupporting1: { data: 'something4' },
        secondary: { data: 'something2' },
        secondarySupporting0: { data: 'something5' },
        secondarySupporting1: { data: 'something6' },
      },
      documentMetadata: {
        attachments: true,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: true,
        supportingDocuments: [
          { supportingDocumentFreeText: 'abc' },
          { attachments: true },
        ],
      },
    });
  });
});
