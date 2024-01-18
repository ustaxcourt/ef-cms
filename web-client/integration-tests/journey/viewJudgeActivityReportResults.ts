import {
  formatDateString,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';
import { getConstants } from '../../src/getConstants';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import {
  refreshElasticsearchIndex,
  waitForLoadingComponentToHide,
} from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const viewJudgeActivityReportResults = (
  cerebralTest: any,
  overrides: { startDate?: string; endDate?: string; judgeName?: string } = {},
) => {
  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
  );

  return it('should submit the form with valid dates and display judge activity report results and Progress Description Table Results', async () => {
    const currentDate = formatDateString(
      prepareDateFromString(),
      getConstants().DATE_FORMATS.MMDDYYYY,
    );

    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      startDate: (overrides.startDate as string) || '01/01/2020',
    });

    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      endDate: overrides.endDate || currentDate,
    });

    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      judgeName: overrides.judgeName || 'Colvin',
    });

    await cerebralTest.runSequence(
      'submitJudgeActivityStatisticsReportSequence',
    );

    await waitForLoadingComponentToHide({ cerebralTest });

    const { progressDescriptionTableTotal } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    cerebralTest.progressDescriptionTableTotal = progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState('judgeActivityReport.judgeActivityReportData'),
    ).toMatchObject(
      expect.objectContaining({
        casesClosedByJudge: expect.anything(),
        opinions: expect.anything(),
        orders: expect.anything(),
        submittedAndCavCasesByJudge: expect.anything(),
        trialSessions: expect.anything(),
      }),
    );
  });
};
