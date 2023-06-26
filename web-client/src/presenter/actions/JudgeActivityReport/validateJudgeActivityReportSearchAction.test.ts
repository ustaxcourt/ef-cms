import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateJudgeActivityReportSearchAction } from './validateJudgeActivityReportSearchAction';

describe('validateJudgeActivityReportSearchAction', () => {
  let mockSuccessPath;
  let mockErrorPath;

  beforeAll(() => {
    mockSuccessPath = jest.fn();
    mockErrorPath = jest.fn();

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the success path when the search critera are all valid', async () => {
    await runAction(validateJudgeActivityReportSearchAction as any, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: '02/02/2022',
            judgeName: 'Colvin',
            startDate: '02/01/2022',
          },
        },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should return the error path when the search critera are NOT valid', async () => {
    await runAction(validateJudgeActivityReportSearchAction as any, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: undefined,
            judgeName: 'Colvin',
            startDate: '02/01/2022',
          },
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: expect.anything(),
    });
  });
});
