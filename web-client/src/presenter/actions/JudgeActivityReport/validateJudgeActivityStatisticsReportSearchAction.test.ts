import {
  FORMATS,
  calculateISODate,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateJudgeActivityStatisticsReportSearchAction } from './validateJudgeActivityStatisticsReportSearchAction';

describe('validateJudgeActivityStatisticsReportSearchAction', () => {
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

  const futureDateIso = calculateISODate({
    howMuch: +1,
    units: 'days',
  });

  const futureDate = applicationContext
    .getUtilities()
    .formatDateString(futureDateIso, FORMATS.MMDDYY);

  it('should return the success path when the search critera are all valid', async () => {
    await runAction(validateJudgeActivityStatisticsReportSearchAction as any, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: '02/02/2022',
            judgeName: judgeUser.name,
            judges: [judgeUser.name],
            startDate: '02/01/2022',
          },
        },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should return the error path when the search critera are NOT valid', async () => {
    await runAction(validateJudgeActivityStatisticsReportSearchAction, {
      modules: { presenter },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: futureDate,
            judgeName: judgeUser.name,
            judges: [judgeUser.name],
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
