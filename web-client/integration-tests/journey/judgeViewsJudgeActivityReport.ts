import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

export const judgeViewsJudgeActivityReportPage = cerebralTest => {
  return it('Judge navigates to Judge Activity Report Page', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const judgeName = cerebralTest.getState(
      'judgeActivityReport.filters.judgeName',
    );

    const { isFormPristine, reportHeader } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(isFormPristine).toBe(true);
    expect(reportHeader).toContain(judgeName);
    expect(cerebralTest.getState('currentPage')).toEqual('JudgeActivityReport');
  });
};
