import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
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

  it('should return the success path when the search criteria is valid', async () => {
    await runAction(validateJudgeActivityReportSearchAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: judgeUser.name,
            judges: [judgeUser.name],
          },
        },
      },
    });
    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should return the error path when the search criteria is invalid', async () => {
    await runAction(validateJudgeActivityReportSearchAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            judgeName: judgeUser.name,
            judges: 'string',
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
