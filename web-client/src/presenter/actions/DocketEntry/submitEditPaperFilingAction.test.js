import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditPaperFilingAction } from './submitEditPaperFilingAction';

describe('submitEditPaperFilingAction', () => {
  const clientConnectionId = '999999999';
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockPaperServicePdfUrl = 'toucancenter.org';
  const mockCaseDetail = {
    docketEntries: [],
    docketNumber: '123-45',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases().editPaperFilingInteractor.mockReturnValue({
      paperServicePdfUrl: mockPaperServicePdfUrl,
    });
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
        clientConnectionId,
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
      documentMetadata: {
        docketNumber: mockCaseDetail.docketNumber,
        isFileAttached: true,
        isPaper: true,
      },
      primaryDocumentFileId: mockDocketEntryId,
    });
  });

  it('should add a coversheet when props.isSavingForLater is false and there is a file attached', async () => {
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
        clientConnectionId,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCaseDetail.docketNumber,
    });
  });

  it('should NOT add a coversheet when props.isSavingForLater is false and there is NOT a file attached', async () => {
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
        clientConnectionId,
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should NOT add a coversheet when props.isSavingForLater is true and there is a file attached', async () => {
    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId,
        docketEntryId: mockDocketEntryId,
        form: {
          isFileAttached: true,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should NOT add a coversheet when props.isSavingForLater is true and a file has been added or replaced', async () => {
    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
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
        clientConnectionId,
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
});
