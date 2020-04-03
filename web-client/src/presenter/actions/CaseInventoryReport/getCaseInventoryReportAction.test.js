import { getCaseInventoryReportAction } from './getCaseInventoryReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getCaseInventoryReportAction', () => {
  let applicationContext;
  const getCaseInventoryReportInteractorMock = jest.fn().mockReturnValue({
    foundCases: [{ docketNumber: '123-20' }],
    totalCount: 12,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      getUseCases: () => ({
        getCaseInventoryReportInteractor: getCaseInventoryReportInteractorMock,
      }),
    };
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

    expect(getCaseInventoryReportInteractorMock).toBeCalledWith({
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

    expect(getCaseInventoryReportInteractorMock).not.toBeCalled();
    expect(result.state.caseInventoryReportData).toBeUndefined();
  });
});
