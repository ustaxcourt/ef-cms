import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseInventoryReportAction } from './getCaseInventoryReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseInventoryReportAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor.mockReturnValue({
        foundCases: [{ docketNumber: '123-20' }],
        totalCount: 12,
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case with params from screenMetadata and set the results on state', async () => {
    const result = await runAction(getCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          associatedJudge: 'Chief Judge',
          status: 'New',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInventoryReportInteractor,
    ).toBeCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: 'Chief Judge',
      status: 'New',
    });
    expect(result.state.caseInventoryReportData).toEqual({
      foundCases: [{ docketNumber: '123-20' }],
      totalCount: 12,
    });
  });

  it('should not call the use case and should unset caseInventoryReportData on state if screenMetadata does not contain associatedJudge or status', async () => {
    const result = await runAction(getCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      state: {
        caseInventoryReportData: {
          foundCases: [{ docketNumber: '123-20' }],
          totalCount: 1,
        },
        screenMetadata: {},
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInventoryReportInteractor,
    ).not.toBeCalled();
    expect(result.state.caseInventoryReportData).toBeUndefined();
  });
});
