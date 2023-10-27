import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitAddPaperFilingAction } from './submitAddPaperFilingAction';

describe('submitAddPaperFilingAction', () => {
  const mockClientConnectionId = '999999999';
  const mockDocketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';

  const mockCaseDetail = {
    docketEntries: [],
    docketNumber: '123-45',
  };

  presenter.providers.applicationContext = applicationContext;

  it('should generate a new docketEntryId when a new paper filing is added without a pdf attached', async () => {
    await runAction(submitAddPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
        isSavingForLater: false,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId: mockClientConnectionId,
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
        docketEntryId: mockDocketEntryId,
        isSavingForLater: false,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId: mockClientConnectionId,
        form: {
          isFileAttached: true,
        },
      },
    });

    const { docketEntryId } =
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1];
    expect(docketEntryId).toBe(mockDocketEntryId);
    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
  });

  it('should make a call to add a paper filed docket entry', async () => {
    const mockConsolidatedGroupDocketNumbers = ['105-32', '106-32', '107-32'];
    const mockIsSavingForLater = false;
    const mockFormData = {
      receivedAt: '2020-12-11T17:05:28Z',
    };

    await runAction(submitAddPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
        docketNumbers: mockConsolidatedGroupDocketNumbers,
        isSavingForLater: mockIsSavingForLater,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId: mockClientConnectionId,
        form: {
          ...mockFormData,
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: mockConsolidatedGroupDocketNumbers,
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        createdAt: mockFormData.receivedAt,
        docketNumber: mockCaseDetail.docketNumber,
        isFileAttached: true,
        isPaper: true,
        receivedAt: mockFormData.receivedAt,
      },
      isSavingForLater: mockIsSavingForLater,
    });
  });
});
