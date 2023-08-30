import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Judges dashboard', () => {
  const cerebralTest = setupTest();

  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  it('save docket number for later test', () => {
    cerebralTest.firstCavDocketNumber = cerebralTest.docketNumber;
  });

  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  loginAs(cerebralTest, 'judgecolvin@example.com');

  it('should display the CAV case', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardJudge');

    const { filteredSubmittedAndCavCasesByJudge } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    const cavCase = filteredSubmittedAndCavCasesByJudge.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
    });
  });

  it('should create and display a primary issue for the CAV case in the table', async () => {
    let { filteredSubmittedAndCavCasesByJudge } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );
    let cavCase = filteredSubmittedAndCavCasesByJudge.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      case: cavCase,
    });

    const expectedPrimaryIssue = 'I can be your hero baby';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updateCasePrimaryIssueSequence');

    ({ filteredSubmittedAndCavCasesByJudge } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ));
    cavCase = filteredSubmittedAndCavCasesByJudge.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      primaryIssue: expectedPrimaryIssue,
      status: CASE_STATUS_TYPES.cav,
    });
  });

  it('should display a brief due date', async () => {
    console.log(
      'cerebralTest.firstCavDocketNumber',
      cerebralTest.firstCavDocketNumber,
    );
    const briefDueDate = '08/29/2023';

    await cerebralTest.runSequence('updateSubmittedCavCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      finalBriefDueDate: briefDueDate,
    });

    const { filteredSubmittedAndCavCasesByJudge } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );
    const cavCase = filteredSubmittedAndCavCasesByJudge.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      finalBriefDueDate: briefDueDate,
      primaryIssue: expect.anything(),
      status: CASE_STATUS_TYPES.cav,
    });

    console.log(
      'filteredSubmittedAndCavCasesByJudge',
      filteredSubmittedAndCavCasesByJudge,
    );
    const otherCavCaseInTable = filteredSubmittedAndCavCasesByJudge.find(
      theCase => theCase.docketNumber === cerebralTest.firstCavDocketNumber,
    );
    console.log('otherCavCaseInTable', otherCavCaseInTable);
    expect(otherCavCaseInTable).toMatchObject({
      docketNumber: cerebralTest.firstCavDocketNumber,
      finalBriefDueDate: undefined,
      status: CASE_STATUS_TYPES.cav,
    });
  });
});
