import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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

  it('should call uploadExternalDocumentsInteractor for a single document file and call addCoversheetInteractor for the added document', async () => {
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
        docketNumber: MOCK_CASE.docketNumber,
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
          practitioner: [mockPrivatePractitioner],
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1].documentMetadata,
    ).toMatchObject({
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
          practitioner: [mockPrivatePractitioner],
          primaryDocumentFile: mockPrimaryDocumentFile,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadExternalDocumentsInteractor.mock
        .calls[0][1].documentMetadata,
    ).toMatchObject({
      privatePractitioners: null,
    });
  });
});
