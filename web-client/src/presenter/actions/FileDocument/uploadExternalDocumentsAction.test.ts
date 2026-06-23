jest.mock('@web-client/presenter/utilities/pollForCoversheetComplete');
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';

describe('uploadExternalDocumentsAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockPollForCoversheetComplete = jest.mocked(pollForCoversheetComplete);

  const mockAnswerDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    processingStatus: 'pending',
    userId: 'petitioner',
  };

  const mockFile = {
    name: 'petition',
    size: 100,
  };

  const mockPrimaryDocumentFile = { data: 'something' };

  const mockDocumentMetadata = {
    attachments: true,
    consolidatedCasesToFileAcross: undefined,
    docketNumber: '101-18',
    fileAcrossConsolidatedGroup: false,
  };

  const mockFileUploadProgressMap = {
    primary: {
      file: mockFile,
      uploadProgress: jest.fn(),
    },
  };

  const mockFiles = { primary: mockPrimaryDocumentFile };

  beforeAll(() => {
    presenter.providers.path = {
      error: () => null,
      success: () => null,
    };
  });

  beforeEach(() => {
    mockPollForCoversheetComplete.mockReset();
    mockPollForCoversheetComplete.mockResolvedValue(undefined);
  });

  it('calls uploadExternalDocumentsInteractor and polls for coversheet completion for the added document', async () => {
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        documentMetadata: mockDocumentMetadata,
        fileUploadProgressMap: mockFileUploadProgressMap,
        files: mockFiles,
      },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFiles: { primary: mockPrimaryDocumentFile },
      documentMetadata: {
        attachments: true,
        consolidatedCasesToFileAcross: undefined,
        docketNumber: MOCK_CASE.docketNumber,
        fileAcrossConsolidatedGroup: false,
      },
    });
    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: MOCK_CASE.docketNumber,
      }),
    );
  });

  it('calls uploadExternalDocumentsInteractor with a list of consolidated cases when filing across consolidated case group', async () => {
    const testCase = {
      ...MOCK_CASE,
      consolidatedCases: [
        { docketNumber: '111-11' },
        { docketNumber: '108-19' },
      ],
      leadDocketNumber: '111-11',
    };

    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: testCase.docketNumber,
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        documentMetadata: {
          ...mockDocumentMetadata,
          attachments: true,
          consolidatedCasesToFileAcross: testCase.consolidatedCases,
          fileAcrossConsolidatedGroup: true,
        },
        fileUploadProgressMap: mockFileUploadProgressMap,
        files: mockFiles,
      },
      state: {
        caseDetail: testCase,
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentFiles: { primary: mockPrimaryDocumentFile },
      documentMetadata: {
        attachments: true,
        consolidatedCasesToFileAcross: testCase.consolidatedCases,
        docketNumber: testCase.docketNumber,
        fileAcrossConsolidatedGroup: true,
      },
    });
    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: testCase.docketNumber,
      }),
    );
  });

  it('calls uploadExternalDocumentsInteractor for a primary and secondary document with multiple supporting documents', async () => {
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        documentMetadata: {
          ...mockDocumentMetadata,
          fileAcrossConsolidatedGroup: undefined,
          hasSecondarySupportingDocuments: true,
          hasSupportingDocuments: true,
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
        fileUploadProgressMap: mockFileUploadProgressMap,
        files: {
          ...mockFiles,
          primarySupporting0: {
            data: 'something3',
          },
          primarySupporting1: {
            data: 'something4',
          },
          secondary: {
            data: 'something2',
          },
          secondarySupporting0: {
            data: 'something5',
          },
          secondarySupporting1: {
            data: 'something6',
          },
        },
      },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1],
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
        docketNumber: MOCK_CASE.docketNumber,
        fileAcrossConsolidatedGroup: undefined,
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: true,
        supportingDocuments: [
          { supportingDocumentFreeText: 'abc' },
          { attachments: true },
        ],
      },
    });
  });

  it('sets documentMetadata.privatePractitioners to form.practitioner when the document to upload is a practitioner case association request', async () => {
    const mockPrivatePractitioner = {
      name: 'Simone Baulk',
    };
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        documentMetadata: {
          ...mockDocumentMetadata,
          fileUploadProgressMap: mockFileUploadProgressMap,
          files: mockFiles,
          privatePractitioners: [mockPrivatePractitioner],
        },
      },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1].documentMetadata,
    ).toMatchObject({
      fileAcrossConsolidatedGroup: false,
      privatePractitioners: [mockPrivatePractitioner],
    });
  });

  it('does not set documentMetadata.privatePractitioners to form.practitioner when the document to upload does not have field filedByPractitioner', async () => {
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        documentMetadata: {
          ...mockDocumentMetadata,
          fileAcrossConsolidatedGroup: undefined,
          fileUploadProgressMap: mockFileUploadProgressMap,
          files: mockFiles,
          privatePractitioners: null,
        },
      },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1].documentMetadata,
    ).toMatchObject({
      fileAcrossConsolidatedGroup: undefined,
      privatePractitioners: null,
    });
  });

  it('returns path.error when the poll times out', async () => {
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
        docketNumber: MOCK_CASE.docketNumber,
      });

    mockPollForCoversheetComplete.mockRejectedValue(new Error('poll timeout'));

    const errorSpy = jest.fn();
    const originalError = console.error;
    console.error = jest.fn();
    presenter.providers.path = {
      error: errorSpy,
      success: () => null,
    };

    await runAction(uploadExternalDocumentsAction, {
      modules: { presenter },
      props: {
        documentMetadata: mockDocumentMetadata,
        fileUploadProgressMap: mockFileUploadProgressMap,
        files: mockFiles,
      },
      state: {
        caseDetail: MOCK_CASE,
      },
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    console.error = originalError;
  });
});
