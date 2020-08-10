import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveCaseDetailInternalEditAction } from './saveCaseDetailInternalEditAction';

describe('saveCaseDetailInternalEditAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the updateCaseTrialSortTags use case if case status is ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor,
    ).not.toBeCalled();
  });

  it('should upload initial filing documents if they exist on the case', async () => {
    const mockRqtFile = {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
    };
    const caseDetail = {
      ...MOCK_CASE,
      documents: [],
      requestForPlaceOfTrialFile: mockRqtFile,
      requestForPlaceOfTrialFileSize: 2,
    };

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafe,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafe.mock
        .calls[0][0].document,
    ).toEqual(mockRqtFile);
    expect(
      applicationContext.getUseCases().saveCaseDetailInternalEditInteractor.mock
        .calls[0][0].caseToUpdate.documents,
    ).toMatchObject(
      expect.arrayContaining([{ documentType: 'Request for Place of Trial' }]),
    );
  });
});
