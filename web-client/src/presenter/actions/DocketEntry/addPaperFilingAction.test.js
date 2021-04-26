import { addPaperFilingAction } from './addPaperFilingAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('addPaperFilingAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };
  });

  it('file a new docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(addPaperFilingAction, {
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
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

  it('file a new docket entry with an uploaded file and return a paper service pdf url', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext.getUseCases().addPaperFilingInteractor.mockReturnValue({
      caseDetail,
      paperServicePdfUrl: mockPdfUrl,
    });

    const result = await runAction(addPaperFilingAction, {
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

  it('file a new docket entry with an uploaded file, but does not generate a coversheet when saved for later', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(addPaperFilingAction, {
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
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

  it('file a new docket entry without an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .addPaperFilingInteractor.mockReturnValue({ caseDetail });

    const result = await runAction(addPaperFilingAction, {
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
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addPaperFilingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      docketEntryId: expect.anything(),
      docketNumber: caseDetail.docketNumber, // uuidv4
      overridePaperServiceAddress: true,
    });
  });
});
