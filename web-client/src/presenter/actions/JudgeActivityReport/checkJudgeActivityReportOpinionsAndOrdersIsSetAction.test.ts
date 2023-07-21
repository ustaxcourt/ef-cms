import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { checkJudgeActivityReportOpinionsAndOrdersIsSetAction } from './checkJudgeActivityReportOpinionsAndOrdersIsSetAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkJudgeActivityReportOpinionsAndOrdersIsSetAction', () => {
  let mockYes;
  let mockNo;

  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    mockYes = jest.fn();
    mockNo = jest.fn();

    presenter.providers.path = {
      no: mockNo,
      yes: mockYes,
    };
  });

  it('should return the no path when either orders and opinions (or both) are not set', async () => {
    await runAction(checkJudgeActivityReportOpinionsAndOrdersIsSetAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {},
        },
      },
    });

    expect(mockNo).toHaveBeenCalled();

    await runAction(checkJudgeActivityReportOpinionsAndOrdersIsSetAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {
            opinions: undefined,
            orders: [],
          },
        },
      },
    });

    expect(mockNo).toHaveBeenCalled();
  });

  it('should return the yes path when both orders and opinions are set', async () => {
    await runAction(checkJudgeActivityReportOpinionsAndOrdersIsSetAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {
            opinions: [],
            orders: [],
          },
        },
      },
    });

    expect(mockYes).toHaveBeenCalled();
  });
});
