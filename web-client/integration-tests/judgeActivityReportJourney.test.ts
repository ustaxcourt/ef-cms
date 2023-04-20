import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Judge activity report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });
  //go to activity report
  //submit form with invalid dates, error message verification
  //add start date and end date
  //verify resuls

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('views the activity report', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence', {});

    // await cerebralTest.runSequence('submitJudgeActivityReportSequence', {});

    const judgeActivityReportHelper = withAppContextDecorator(
      judgeActivityReportHelperComputed,
    );

    const { isFormPristine } = runCompute(judgeActivityReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(isFormPristine).toBe(true);
  });
});
