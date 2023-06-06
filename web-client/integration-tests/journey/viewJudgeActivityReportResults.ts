import {
  formatDateString,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';
import { getConstants } from '../../src/getConstants';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

export const viewJudgeActivityReportResults = (
  cerebralTest: any,
  overrides: { startDate?: string; endDate?: string } = {},
) => {
  return it('should submit the form with valid dates and display judge activity report results and Progress Description Table Results', async () => {
    const currentDate = formatDateString(
      prepareDateFromString(),
      getConstants().DATE_FORMATS.MMDDYYYY,
    );

    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: (overrides.startDate as string) || '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: overrides.endDate || currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const { progressDescriptionTableTotal } = runCompute(
      judgeActivityReportHelper as any,
      {
        state: cerebralTest.getState(),
      },
    );

    cerebralTest.progressDescriptionTableTotal = progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
  });
};
