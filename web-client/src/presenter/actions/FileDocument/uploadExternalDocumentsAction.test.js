import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

const uploadExternalDocumentsInteractor = applicationContext.getUseCases()
  .uploadExternalDocumentsInteractor;

const addCoversheetInteractor = applicationContext.getUseCases()
  .addCoversheetInteractor;

describe('uploadExternalDocumentsAction', () => {
  beforeEach(() => {
    presenter.providers.path = {
      error: () => null,
      success: () => null,
    };
  });

  it('should call uploadExternalDocumentsInteractor for a single document file and call addCoversheetInteractor for the pending document', async () => {
    uploadExternalDocumentsInteractor.mockReturnValue({
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

    expect(uploadExternalDocumentsInteractor.mock.calls.length).toEqual(1);
    expect(uploadExternalDocumentsInteractor.mock.calls[0][0]).toMatchObject({
      documentFiles: { primary: { data: 'something' } },
      documentMetadata: {
        attachments: true,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    });
    expect(addCoversheetInteractor.mock.calls.length).toEqual(1);
    expect(addCoversheetInteractor.mock.calls[0][0]).toMatchObject({
      caseId: MOCK_CASE.caseId,
      documentId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  it('should call uploadExternalDocumentsInteractor for a single document file and also skip addCoversheetInteractor for any pending documents without a file attached', async () => {
    uploadExternalDocumentsInteractor.mockReturnValue({
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
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          isFileAttached: false,
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

    expect(uploadExternalDocumentsInteractor.mock.calls.length).toEqual(1);
    expect(uploadExternalDocumentsInteractor.mock.calls[0][0]).toMatchObject({
      documentFiles: { primary: { data: 'something' } },
      documentMetadata: {
        attachments: true,
        caseId: MOCK_CASE.caseId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    });
    expect(addCoversheetInteractor.mock.calls.length).toEqual(1);
    expect(addCoversheetInteractor.mock.calls[0][0]).toMatchObject({
      caseId: MOCK_CASE.caseId,
      documentId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  it('should call uploadExternalDocumentsInteractor for a primary and secondary document with multiple supporting documents', async () => {
    uploadExternalDocumentsInteractor.mockReturnValue(MOCK_CASE);

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

    expect(uploadExternalDocumentsInteractor.mock.calls.length).toEqual(1);
    expect(uploadExternalDocumentsInteractor.mock.calls[0][0]).toMatchObject({
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
