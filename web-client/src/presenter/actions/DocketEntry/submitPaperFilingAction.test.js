import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitPaperFilingAction } from './submitPaperFilingAction';

presenter.providers.applicationContext = applicationContext;

describe('submitPaperFilingAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };
  });

  it('should file a new docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock.calls[0][1]
        .generateCoversheet,
    ).toEqual(true);
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: 'document-id-123',
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });

  it('should file a new docket entry with an uploaded file and return a paper service pdf url', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext.getUseCases().addPaperFilingInteractor.mockReturnValue({
      caseDetail,
      paperServicePdfUrl: mockPdfUrl,
    });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(result.output.pdfUrl).toEqual(mockPdfUrl);
  });

  it('should file a new docket entry with an uploaded file, but does not set generateCoversheet to true when saved for later', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: 'document-id-123',
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock.calls[0][1]
        .generateCoversheet,
    ).toBeFalsy();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: 'document-id-123',
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });

  it('should file a new docket entry without an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock.calls[0][1]
        .generateCoversheet,
    ).toBeFalsy();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: expect.anything(),
      docketNumber: caseDetail.docketNumber, // uuidv4
      overridePaperServiceAddress: true,
    });
  });

  it('should save an existing docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .editPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail,
        docketEntryId: 'document-id-123',
        form: {
          isFileAttached: true,
          primaryDocumentFile: {},
        },
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1].generateCoversheet,
    ).toBeFalsy();
    expect(
      applicationContext.getUseCases().editPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: 'document-id-123',
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });

  it('should save an existing docket entry without uploading a file', async () => {
    applicationContext
      .getUseCases()
      .editPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail,
        docketEntryId: 'document-id-123',
        document: '123-456-789-abc',
        form: {},
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1].generateCoversheet,
    ).toBeFalsy();
    expect(
      applicationContext.getUseCases().editPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: 'document-id-123',
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });

  it('should save and serve an existing docket entry without uploading a file, but sets generateCoversheet to true', async () => {
    applicationContext
      .getUseCases()
      .editPaperFilingInteractor.mockReturnValue({ caseDetail });

    caseDetail.docketEntries.push({
      docketEntryId: 'document-id-123',
      isFileAttached: true,
    });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
      },
      state: {
        caseDetail,
        docketEntryId: 'document-id-123',
        document: '123-456-789-abc',
        form: {
          isFileAttached: true,
        },
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1].generateCoversheet,
    ).toEqual(true);
    expect(
      applicationContext.getUseCases().editPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: 'document-id-123',
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });

  it('should save an existing docket entry with an uploaded file and return a paper service pdf url', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext.getUseCases().editPaperFilingInteractor.mockReturnValue({
      caseDetail,
      paperServicePdfUrl: mockPdfUrl,
    });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        docketEntryId: 'document-id-123',
        form: {
          isFileAttached: true,
          primaryDocumentFile: {},
        },
        isEditingDocketEntry: true,
      },
    });

    expect(result.output.pdfUrl).toEqual(mockPdfUrl);
  });
});
