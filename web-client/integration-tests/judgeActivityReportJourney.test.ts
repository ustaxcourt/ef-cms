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
  it('should disable the submit button on inital page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const judgeActivityReportHelper = withAppContextDecorator(
      judgeActivityReportHelperComputed,
    );

    const { isFormPristine } = runCompute(judgeActivityReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(isFormPristine).toBe(true);
  });

  it('should display an error message when invalid dates are entered into the form', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'startDate',
      value: '--_--',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'endDate',
      value: 'yabbadabaadooooo',
    });

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      endDate: 'Enter a valid end date.',
      startDate: 'Enter a valid start date.',
    });
  });
});
