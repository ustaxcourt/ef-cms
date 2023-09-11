import {
  CASE_STATUS_TYPES,
  STATUS_OF_MATTER_OPTIONS,
} from '../../shared/src/business/entities/EntityConstants';
import { caseWorksheetsHelper as caseWorksheetsHelperComputed } from '@web-client/presenter/computeds/CaseWorksheets/caseWorksheetsHelper';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Case Worksheets Journey', () => {
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
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );

  it('save docket number for later test', () => {
    cerebralTest.submittedCaseDocketNumber = cerebralTest.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should display the case worksheets table on the dashboard', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardJudge');

    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });

    const submittedCase = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    );
    const cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(submittedCase).toMatchObject({
      docketNumber: cerebralTest.submittedCaseDocketNumber,
      status: CASE_STATUS_TYPES.submitted,
    });
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
    });
  });

  it('should persist and display a primary issue set by the user', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    const { modal } = cerebralTest.getState();
    expect(modal.showModal).toEqual('AddEditPrimaryIssueModal');

    const expectedPrimaryIssue = 'I can be your hero baby';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.primaryIssue',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updatePrimaryIssueSequence');

    const { modal: modal2 } = cerebralTest.getState();
    expect(modal2.showModal).toBeUndefined();

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

  it('should allow the user to edit a pre-existing primary issue', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    const existingPrimaryIssue = cerebralTest.getState('modal.primaryIssue');
    expect(existingPrimaryIssue).toEqual('I can be your hero baby');

    const updatedPrimaryIssue = 'Her name is Noel';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.primaryIssue',
      value: updatedPrimaryIssue,
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
      worksheet: { primaryIssue: updatedPrimaryIssue },
    });
  });

  it('should display an error message when the user enters an invalid primary issue', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    const invalidPrimaryIssue = ''; // primaryIssue can't be an empty string

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.primaryIssue',
      value: invalidPrimaryIssue,
    });

    await cerebralTest.runSequence('updatePrimaryIssueSequence');

    const validationErrors = cerebralTest.getState('validationErrors');
    expect(validationErrors.primaryIssue).toEqual('Add primary issue');
  });

  it('should persist and remove a primary issue from the table when it is deleted by the user', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase?.worksheet.primaryIssue).toBeDefined();

    await cerebralTest.runSequence('openDeletePrimaryIssueSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('deletePrimaryIssueSequence');

    ({ caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    }));
    cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    expect(cavCase?.worksheet.primaryIssue).toBeUndefined();
  });

  it('should persist and display a final brief due date set by user', async () => {
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
      },
    });

    const otherCavCaseInTable = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    )!;
    expect(otherCavCaseInTable.worksheet.finalBriefDueDate).toBeUndefined();
  });

  it('should display an error message when an invalid brief due date is set', async () => {
    const caseWorksheetTableErrors = cerebralTest.getState(
      'validationErrors.submittedCavCasesTable',
    );
    expect(
      caseWorksheetTableErrors[cerebralTest.docketNumber]?.finalBriefDueDate,
    ).toBeUndefined();

    const invalidBriefDueDate = '08/29/TEST';

    await cerebralTest.runSequence('updateFinalBriefDueDateSequence', {
      docketNumber: cerebralTest.docketNumber,
      finalBriefDueDate: invalidBriefDueDate,
    });

    const caseWorksheetTableErrorsAfter = cerebralTest.getState(
      'validationErrors.submittedCavCasesTable',
    );
    expect(caseWorksheetTableErrorsAfter[cerebralTest.docketNumber]).toEqual({
      finalBriefDueDate: 'Enter a valid due date',
    });
  });

  it('should persist and display a status of matter set by the user', async () => {
    await cerebralTest.runSequence('updateStatusOfMatterSequence', {
      docketNumber: cerebralTest.docketNumber,
      statusOfMatter: STATUS_OF_MATTER_OPTIONS[0],
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
        statusOfMatter: STATUS_OF_MATTER_OPTIONS[0],
      },
    });
  });

  loginAs(cerebralTest, 'colvinschambers@example.com');
  it('should display the case worksheets table on the dashboard, including changes to case worksheets that the judge has made', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardChambers');

    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });

    const submittedCase = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    );
    const cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(submittedCase).toMatchObject({
      docketNumber: cerebralTest.submittedCaseDocketNumber,
      status: CASE_STATUS_TYPES.submitted,
    });
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
      worksheet: {
        finalBriefDueDate: '2023-08-29',
        statusOfMatter: STATUS_OF_MATTER_OPTIONS[0],
      },
    });
  });

  it('should persist and display updates a chambers user makes to a case worksheet', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let submittedCase = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    );

    await cerebralTest.runSequence('openAddEditPrimaryIssueModalSequence', {
      docketNumber: submittedCase!.docketNumber,
    });

    const expectedPrimaryIssue =
      'But I don`t feel like dancin`, no sir, no dancin` today';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.primaryIssue',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updatePrimaryIssueSequence');

    ({ caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    }));
    submittedCase = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    );
    expect(submittedCase).toMatchObject({
      docketNumber: cerebralTest.submittedCaseDocketNumber,
      status: CASE_STATUS_TYPES.submitted,
      worksheet: { primaryIssue: expectedPrimaryIssue },
    });
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should display the case worksheets table on the dashboard, including changes to case worksheets that chambers users have made', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });

    const submittedCase = caseWorksheetsFormatted.find(
      theCase =>
        theCase.docketNumber === cerebralTest.submittedCaseDocketNumber,
    );
    const cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(submittedCase).toMatchObject({
      docketNumber: cerebralTest.submittedCaseDocketNumber,
      status: CASE_STATUS_TYPES.submitted,
      worksheet: {
        primaryIssue: 'But I don`t feel like dancin`, no sir, no dancin` today',
      },
    });
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
    });
  });
});
