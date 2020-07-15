import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveDocketEntryAction } from './saveDocketEntryAction';

presenter.providers.applicationContext = applicationContext;

describe('saveDocketEntryAction', () => {
  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
      documents: [],
    };
  });

  it('file a new docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveDocketEntryAction, {
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
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: 'document-id-123',
      overridePaperServiceAddress: true,
    });
  });

  it('file a new docket entry with an uploaded file, but does not generate a coversheet when saved for later', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'document-id-123',
        shouldGenerateCoversheet: false,
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
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: 'document-id-123',
      overridePaperServiceAddress: true,
    });
  });

  it('file a new docket entry without an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveDocketEntryAction, {
      modules: {
        presenter,
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
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: expect.anything(), // uuidv4
      overridePaperServiceAddress: true,
    });
  });

  it('saves an existing docket entry with an uploaded file', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: 'document-id-123',
        shouldGenerateCoversheet: false,
      },
      state: {
        caseDetail,
        form: {
          primaryDocumentFile: {},
        },
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: 'document-id-123',
      overridePaperServiceAddress: true,
    });
  });

  it('saves an existing docket entry without uploading a file', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(saveDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        documentId: 'document-id-123',
        form: {},
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: 'document-id-123',
      overridePaperServiceAddress: true,
    });
  });

  it('saves and serves an existing docket entry without uploading a file, but adds a coversheet', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue(caseDetail);

    caseDetail.documents.push({
      documentId: 'document-id-123',
      isFileAttached: true,
    });

    const result = await runAction(saveDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        documentId: 'document-id-123',
        form: {},
        isEditingDocketEntry: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).not.toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.caseId,
      docketNumber: caseDetail.docketNumber,
      documentId: 'document-id-123',
      overridePaperServiceAddress: true,
    });
  });
});
