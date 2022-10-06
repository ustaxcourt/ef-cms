import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitPaperFilingAction } from './submitPaperFilingAction';

describe('submitPaperFilingAction', () => {
  const docketNumbers = ['123-45'];
  const clientConnectionId = '999999999';
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';

  let caseDetail;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    caseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };
  });

  it('should make a call to add a new docket entry when state.isEditingDocketEntry is false', async () => {
    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail,
        clientConnectionId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail: {},
      docketEntryId: mockDocketEntryId,
      docketNumber: caseDetail.docketNumber,
      overridePaperServiceAddress: true,
      pdfUrl: undefined,
    });
  });

  it('should NOT return a paper service pdf url when adding a new paper filing because the URL will be returned via a websocket notification after all document proccessing has finished', async () => {
    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail,
        clientConnectionId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(result.output.pdfUrl).toBeUndefined();
  });

  it('should make a call to add a new docket entry even when a file has not been uploaded and the user is saving for later', async () => {
    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
        isSavingForLater: true,
      },
      state: {
        caseDetail,
        clientConnectionId,
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject({ clientConnectionId });
    expect(result.output).toEqual({
      caseDetail: {},
      docketEntryId: expect.anything(),
      docketNumber: caseDetail.docketNumber, // uuidv4
      overridePaperServiceAddress: true,
      pdfUrl: undefined,
    });
  });

  it('saves an existing docket entry with an uploaded file', async () => {
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
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

  it('saves an existing docket entry without uploading a file', async () => {
    applicationContext
      .getUseCases()
      .editPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(submitPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
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

  it('saves and serves an existing docket entry without uploading a file, but adds a coversheet', async () => {
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
        docketNumbers,
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
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
      props: {
        docketNumbers,
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
