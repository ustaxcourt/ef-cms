import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';

describe('uploadExternalDocumentsAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockAnswerDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    processingStatus: 'pending',
    userId: 'petitioner',
  };

  beforeAll(() => {
    presenter.providers.path = {
      error: () => null,
      success: () => null,
    };
  });

  it('should call uploadExternalDocumentsInteractor for a single document file and call addCoversheetInteractor with the case docketNumber for the added document', async () => {
    const mockPrimaryDocumentFile = { data: 'something' };
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [mockAnswerDocketEntry],
        },
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          fileAcrossConsolidatedGroup: false,
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
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
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: MOCK_CASE.docketNumber,
    });
  });

  it('should call uploadExternalDocumentsInteractor with a list of consolidated cases when filing across consolidated case group', async () => {
    const mockPrimaryDocumentFile = { data: 'something' };
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
        caseDetail: {
          ...testCase,
          docketEntries: [mockAnswerDocketEntry],
        },
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: testCase,
        form: {
          attachments: true,
          fileAcrossConsolidatedGroup: true,
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
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
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: 'f6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: testCase.docketNumber,
    });
  });

  it('should call uploadExternalDocumentsInteractor for a primary and secondary document with multiple supporting documents', async () => {
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue(MOCK_CASE);

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          fileAcrossConsolidatedGroup: undefined,
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

  it('should set documentMetadata.privatePractitioners to form.practitioner when the document to upload is a practitioner association request', async () => {
    const mockPrimaryDocumentFile = { data: 'something' };
    const mockPrivatePractitioner = {
      name: 'Simone Baulk',
    };
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [mockAnswerDocketEntry],
        },
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          eventCode: PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP[0].eventCode,
          fileAcrossConsolidatedGroup: false,
          practitioner: [mockPrivatePractitioner],
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
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

  it('should not set documentMetadata.privatePractitioners to form.practitioner when the document to upload does not have field filedByPractitioner', async () => {
    const mockPrimaryDocumentFile = { data: 'something' };
    const mockPrivatePractitioner = {
      name: 'Simone Biles',
    };
    applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor.mockReturnValue({
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [mockAnswerDocketEntry],
        },
        docketEntryIdsAdded: [mockAnswerDocketEntry.docketEntryId],
      });

    await runAction(uploadExternalDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          attachments: true,
          fileAcrossConsolidatedGroup: undefined,
          practitioner: [mockPrivatePractitioner],
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
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
});
