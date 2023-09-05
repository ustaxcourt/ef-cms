import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { caseWorksheetsHelper as caseWorksheetsHelperComputed } from '@web-client/presenter/computeds/CaseWorksheets/caseWorksheetsHelper';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Judges dashboard', () => {
  const cerebralTest = setupTest();

  const caseWorksheetsHelper = withAppContextDecorator(
    caseWorksheetsHelperComputed,
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
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  loginAs(cerebralTest, 'judgecolvin@example.com');

  it('should display the CAV case', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardJudge');

    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });

    const cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
    });
  });

  it('should create and display a primary issue for the CAV case in the table', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    const expectedPrimaryIssue = 'I can be your hero baby';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.primaryIssue',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updatePrimaryIssueSequence');

    ({ caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    }));
    cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
      worksheet: { primaryIssue: expectedPrimaryIssue },
    });
  });

  it('should set state with updated brief due date set by user', async () => {
    const briefDueDate = '08/29/2023';

    await cerebralTest.runSequence('updateFinalBriefDueDateSequence', {
      docketNumber: cerebralTest.docketNumber,
      finalBriefDueDate: briefDueDate,
    });

    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    const cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
      worksheet: {
        finalBriefDueDate: '2023-08-29',
        primaryIssue: expect.anything(),
      },
    });

    const otherCavCaseInTable = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.firstCavDocketNumber,
    )!;
    expect(otherCavCaseInTable.worksheet.finalBriefDueDate).toBeUndefined();
  });

  it('should setup error message state for when an invalid brief due date is set', async () => {
    //assert no existing errors in state
    //state.validationErrors.submittedCavCasesTable[docketNumber]
    let tableItemErrors =
      cerebralTest.getState('state.validationErrors.submittedCavCasesTable') ||
      {};
    expect(tableItemErrors[cerebralTest.docketNumber]).toBeUndefined();

    // set date to an invalid date\
    const invalidBriefDueDate = '08/29/TEST';

    await cerebralTest.runSequence('updateFinalBriefDueDateSequence', {
      docketNumber: cerebralTest.docketNumber,
      finalBriefDueDate: invalidBriefDueDate,
    });

    // check error message in state
    tableItemErrors = cerebralTest.getState(
      'state.validationErrors.submittedCavCasesTable',
    );
    expect(tableItemErrors[cerebralTest.docketNumber]).toMatchObject({
      finalBriefDueDate: 'abc',
    });
    //assert
  });
  //edit primary
  //invalid not
  //delete primary
  //invalid brief date
  //status of matter persistence
});
