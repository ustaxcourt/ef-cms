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
      props: {},
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
      props: {},
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor,
    ).not.toBeCalled();
  });
});
