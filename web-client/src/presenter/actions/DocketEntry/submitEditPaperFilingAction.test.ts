import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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

  it('should make a call to edit a paper filed docket entry and include consolidated group docket numbers when user has opted to multi-docket the paper filing', async () => {
    const mockConsolidatedDocketNumbers = ['101-32', '102-32'];
    const mockIsSavingForLater = false;
    const mockDateRecieved = '2012-04-20T14:45:15.595Z';

    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers: mockConsolidatedDocketNumbers,
        isSavingForLater: mockIsSavingForLater,
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        caseDetail: mockCaseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
          receivedAt: mockDateRecieved,
        },
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1],
    ).toEqual({
      consolidatedGroupDocketNumbers: mockConsolidatedDocketNumbers,
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        createdAt: mockDateRecieved,
        docketNumber: mockCaseDetail.docketNumber,
        isFileAttached: true,
        isPaper: true,
        receivedAt: mockDateRecieved,
      },
      isSavingForLater: mockIsSavingForLater,
    });
  });
});
