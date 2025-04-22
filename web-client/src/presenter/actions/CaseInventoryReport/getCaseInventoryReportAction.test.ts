import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseInventoryReportAction } from './getCaseInventoryReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseInventoryReportAction', () => {
  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor.mockReturnValue({
        foundCases: [{ docketNumber: '123-20' }],
        totalCount: 1,
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case with params from screenMetadata and set the results on state', async () => {
    const result = await runAction(getCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
          status: STATUS_TYPES.new,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInventoryReportInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      status: STATUS_TYPES.new,
    });
    expect(result.state.caseInventoryReportData).toEqual({
      foundCasesForCurrentPage: [{ docketNumber: '123-20' }],
      foundCasesTotalCount: 1,
    });
  });

  it('should not call the use case and should unset caseInventoryReportData on state if screenMetadata does not contain associatedJudge or status', async () => {
    const result = await runAction(getCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        caseInventoryReportData: {
          foundCasesForCurrentPage: [{ docketNumber: '123-20' }],
          foundCasesTotalCount: 1,
        },
        screenMetadata: {},
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInventoryReportInteractor,
    ).not.toHaveBeenCalled();
    expect(result.state.caseInventoryReportData).toBeUndefined();
  });
});
