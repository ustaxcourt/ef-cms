import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitAddPaperFilingAction } from './submitAddPaperFilingAction';

describe('submitAddPaperFilingAction', () => {
  const mockClientConnectionId = '999999999';
  const mockDocumentStorageId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';
  const mockConsolidatedGroupDocketNumbers = ['105-32', '106-32', '107-32'];
  const mockIsSavingForLater = false;
  const mockFormData = {
    receivedAt: '2020-12-11T17:05:28Z',
  };
  const mockCaseDetail = {
    docketEntries: [],
    docketNumber: '123-45',
  };

  presenter.providers.applicationContext = applicationContext;

  it('should make a call to add a paper filed docket entry', async () => {
    await runAction(submitAddPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        documentStorageId: mockDocumentStorageId,
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
      documentStorageId: mockDocumentStorageId,
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

  it('should use isFileAttached form value instead of primaryDocumentFile form value to make a call to add a paper filed docket entry', async () => {
    await runAction(submitAddPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        documentStorageId: mockDocumentStorageId,
        docketNumbers: mockConsolidatedGroupDocketNumbers,
        isSavingForLater: mockIsSavingForLater,
      },
      state: {
        caseDetail: mockCaseDetail,
        clientConnectionId: mockClientConnectionId,
        form: {
          ...mockFormData,
          isFileAttached: true,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: mockConsolidatedGroupDocketNumbers,
      documentStorageId: mockDocumentStorageId,
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
