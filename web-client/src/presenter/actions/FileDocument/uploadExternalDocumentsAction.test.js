import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';

describe('uploadExternalDocumentsAction', () => {
  const { uploadExternalDocumentsInteractor } =
    applicationContext.getUseCases();

  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    presenter.providers.path = {
      error: () => null,
      success: () => null,
    };
  });

  it('should call uploadExternalDocumentsInteractor for a single document file', async () => {
    uploadExternalDocumentsInteractor.mockImplementation(() => {
      return {
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketEntryId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentTitle: 'Answer',
              documentType: 'Answer',
              eventCode: 'A',
              processingStatus: 'pending',
              userId: 'petitioner',
            },
          ],
        },
      };
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
    expect(uploadExternalDocumentsInteractor.mock.calls[0][1]).toMatchObject({
      documentFiles: { primary: { data: 'something' } },
      documentMetadata: {
        attachments: true,
        docketNumber: MOCK_CASE.docketNumber,
      },
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
          secondaryDocument: {},
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
    expect(uploadExternalDocumentsInteractor.mock.calls[0][1]).toMatchObject({
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
