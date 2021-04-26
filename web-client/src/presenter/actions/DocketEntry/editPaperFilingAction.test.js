import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { editPaperFilingAction } from './editPaperFilingAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('editPaperFilingAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };
  });

  it('saves an existing docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .editPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(editPaperFilingAction, {
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
      applicationContext.getUseCases().virusScanPdfInteractor,
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

    const result = await runAction(editPaperFilingAction, {
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
      applicationContext.getUseCases().virusScanPdfInteractor,
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

    const result = await runAction(editPaperFilingAction, {
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
      applicationContext.getUseCases().virusScanPdfInteractor,
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

    const result = await runAction(editPaperFilingAction, {
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
      },
    });

    expect(result.output.pdfUrl).toEqual(mockPdfUrl);
  });
});
