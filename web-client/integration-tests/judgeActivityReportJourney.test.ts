import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { viewJudgeActivityReportResults } from './journey/viewJudgeActivityReportResults';
import { withAppContextDecorator } from '../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

let progressDescriptionTableTotalBefore = 0;

describe('Judge activity report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should disable the submit button on initial page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const { isFormPristine, reportHeader } = runCompute(
      judgeActivityReportHelper as any,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(isFormPristine).toBe(true);
    expect(reportHeader).toContain('Colvin');
  });

  it('should display an error message when invalid dates are entered into the form', async () => {
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '--_--',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: 'yabbadabaadooooo',
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      endDate: 'Enter a valid end date.',
      startDate: 'Enter a valid start date.',
    });
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );

  loginAs(cerebralTest, 'judgecolvin@example.com');

  viewJudgeActivityReportResults(cerebralTest);
  it('should increase progressDescriptionTableTotal by 2 when there is one "CAV" case and one "Submitted" case added', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore + 2,
    );
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should not increase progressDescriptionTableTotal when a non-submitted or non-CAV case is added', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order and Decision',
    eventCode: 'OAD',
    expectedDocumentType: 'Order and Decision',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0, 'Colvin');
  docketClerkServesDocument(cerebralTest, 0);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should not increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });
});
