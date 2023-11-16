import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { FORMATS } from '@shared/business/utilities/DateHandler';
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

    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'AddEditCaseWorksheetModal',
    );

    const expectedPrimaryIssue = 'I can be your hero baby';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'form.primaryIssue',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();

    ({ caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    }));
    cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );
    expect(cavCase).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
      status: CASE_STATUS_TYPES.cav,
      worksheet: {
        docketNumber: cerebralTest.docketNumber,
        entityName: 'CaseWorksheet',
        primaryIssue: expectedPrimaryIssue,
      },
    });
  });

  it('should allow the user to edit a pre-existing primary issue', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    );

    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cavCase!.docketNumber,
    });

    expect(cerebralTest.getState('form.primaryIssue')).toEqual(
      'I can be your hero baby',
    );

    const updatedPrimaryIssue = 'Her name is Noel';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'form.primaryIssue',
      value: updatedPrimaryIssue,
    });

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

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

  it('should allow the user to clear the primary issue', async () => {
    let { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    });
    let cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    )!;
    expect(cavCase.worksheet!.primaryIssue).toBeDefined();

    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'form.primaryIssue',
      value: '',
    });

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

    ({ caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: cerebralTest.getState(),
    }));
    cavCase = caseWorksheetsFormatted.find(
      theCase => theCase.docketNumber === cerebralTest.docketNumber,
    )!;
    expect(cavCase.worksheet!.primaryIssue).toBe('');
  });

  it('should persist and display a final brief due date set by user', async () => {
    const briefDueDate = '08/29/2023';

    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'finalBriefDueDate',
        toFormat: FORMATS.YYYYMMDD,
        value: briefDueDate,
      },
    );

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

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
    expect(otherCavCaseInTable.finalBriefDueDateFormatted).toEqual('');
  });

  it('should display an error message when the user enters an invalid final brief due date', async () => {
    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'finalBriefDueDate',
        toFormat: FORMATS.YYYYMMDD,
        value: 'abcdefghi', // not a valid date
      },
    );

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      finalBriefDueDate: 'Enter a valid due date',
    });

    await cerebralTest.runSequence('dismissAddEditCaseWorksheetModalSequence');
  });

  it('should persist and display a status of matter set by the user', async () => {
    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statusOfMatter',
      value: CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
    });

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

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
        docketNumber: cerebralTest.docketNumber,
        finalBriefDueDate: '2023-08-29',
        statusOfMatter: CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
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
        statusOfMatter: CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
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

    await cerebralTest.runSequence('openAddEditCaseWorksheetModalSequence', {
      docketNumber: submittedCase!.docketNumber,
    });

    const expectedPrimaryIssue =
      'But I don`t feel like dancin`, no sir, no dancin` today';
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'form.primaryIssue',
      value: expectedPrimaryIssue,
    });

    await cerebralTest.runSequence('updateCaseWorksheetSequence');

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
