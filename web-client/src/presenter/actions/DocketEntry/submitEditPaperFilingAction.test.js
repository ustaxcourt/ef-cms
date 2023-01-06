import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditPaperFilingAction } from './submitEditPaperFilingAction';

describe('submitEditPaperFilingAction', () => {
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockPaperServicePdfUrl = 'toucancenter.org';
  const mockCaseDetail = {
    docketEntries: [],
    docketNumber: '123-45',
  };

  presenter.providers.applicationContext = applicationContext;

  applicationContext.getUseCases().editPaperFilingInteractor.mockReturnValue({
    paperServicePdfUrl: mockPaperServicePdfUrl,
  });

  it('should make a call to edit a paper filed docket entry', async () => {
    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        docketNumber: mockCaseDetail.docketNumber,
        isFileAttached: true,
        isPaper: true,
      },
    });
  });

  it('should return generateCoversheet true when props.isSavingForLater is false and there is a primary document file', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.generateCoversheet).toBe(true);
  });

  it('should return generateCoversheet false when props.isSavingForLater is false and there is NOT a primary document file', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(output.generateCoversheet).toBe(false);
  });

  it('should return generateCoversheet false when props.isSavingForLater is true and isFileAttached is true', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          isFileAttached: true,
        },
      },
    });

    expect(output.generateCoversheet).toBe(false);
  });

  it('should return generateCoversheet false when props.isSavingForLater is true and a file has been added or replaced', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.generateCoversheet).toBe(false);
  });

  it('should return the paper service pdf url to props', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output).toMatchObject({
      pdfUrl: mockPaperServicePdfUrl,
    });
  });

  it('should return the docketEntryId to props', async () => {
    const { output } = await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });
});
