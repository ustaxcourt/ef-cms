import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Judge activity report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should disable the submit button on inital page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const judgeActivityReportHelper = withAppContextDecorator(
      judgeActivityReportHelperComputed,
    );

    const { isFormPristine, reportHeader } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(isFormPristine).toBe(true);
    expect(reportHeader).toContain('Colvin');
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

  it('should submit the form with valid dates and display judge activity report results', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'startDate',
      value: '01/01/2020',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'endDate',
      value: '04/01/2023',
    });

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      trialSessions: expect.anything(),
    });
  });
});
