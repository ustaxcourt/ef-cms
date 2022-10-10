import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitAddPaperFilingAction } from './submitAddPaperFilingAction';

describe('submitAddPaperFilingAction', () => {
  const clientConnectionId = '999999999';
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockPaperServicePdfUrl = 'toucancenter.org';

  let mockCaseDetail;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    mockCaseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };

    applicationContext.getUseCases().editPaperFilingInteractor.mockReturnValue({
      caseDetail: mockCaseDetail,
      paperServicePdfUrl: mockPaperServicePdfUrl,
    });
  });

  it('should generate a new docketEntryId when a new paper filing is added without a pdf attached', async () => {
    await runAction(submitAddPaperFilingAction, {
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

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
  });

  it('should NOT generate a new docketEntryId when a new paper filing is added with a pdf attached', async () => {
    await runAction(submitAddPaperFilingAction, {
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
          isFileAttached: true,
        },
      },
    });

    const { primaryDocumentFileId } =
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1];

    expect(primaryDocumentFileId).toBe(mockDocketEntryId);
    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
  });

  it('should make a call to add a paper filed docket entry', async () => {
    await runAction(submitAddPaperFilingAction, {
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
      applicationContext.getUseCases().addPaperFilingInteractor.mock
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

  it('should return docket entry information to props', async () => {
    const { output } = await runAction(submitAddPaperFilingAction, {
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
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCaseDetail.docketNumber,
      overridePaperServiceAddress: true,
    });
  });
});
