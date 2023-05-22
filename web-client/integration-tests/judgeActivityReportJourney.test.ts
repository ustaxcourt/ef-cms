import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  formatDateString,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import { getConstants } from '../src/getConstants';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const currentDate = formatDateString(
  prepareDateFromString(),
  getConstants().DATE_FORMATS.MMDDYYYY,
);

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

describe('Judge activity report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should disable the submit button on initial page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

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

  it("Get judge's Progress Description table count before", async () => {
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    cerebralTest.progressDescriptionTableTotalBefore = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;
  });

  it('should submit the form with valid dates and display judge activity report results', async () => {
    const { progressDescriptionTableTotalBefore } = cerebralTest;
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const progressDescriptionTableTotalAfter = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });

  // create a single CAV case
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  // create a single Submitted case
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should submit the form with valid dates and display judge activity report results with Progress Description Table Total increase by 2 when there is one "CAV" case and one "Submitted" case added', async () => {
    const { progressDescriptionTableTotalBefore } = cerebralTest;
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const progressDescriptionTableTotalAfter = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore + 2,
    );
  });

  it("Get judge's Progress Description table count before", async () => {
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    cerebralTest.progressDescriptionTableTotalBefore = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;
  });

  // create another non "Submitted" or "CAV" case
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should submit the form with valid dates and display judge activity report results with Progress Description Table Total without increasing the count when a non-submitted or non-CAV case is added', async () => {
    const { progressDescriptionTableTotalBefore } = cerebralTest;
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const progressDescriptionTableTotalAfter = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });

  it("Get judge's Progress Description table count before", async () => {
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    cerebralTest.progressDescriptionTableTotalBefore = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;
  });

  // create a submitted case and then creates a docket entry with an event code of OAD
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
  it('should submit the form with valid dates and display judge activity report results with Progress Description Table Total without increasing the count when a case with a status of "Submitted" and has a decision-type of document on the docket record', async () => {
    const { progressDescriptionTableTotalBefore } = cerebralTest;
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        startDate: '01/01/2020',
      },
    );

    await cerebralTest.runSequence(
      'selectDateRangeFromJudgeActivityReportSequence',
      {
        endDate: currentDate,
      },
    );

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const progressDescriptionTableTotalAfter = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    ).progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('judgeActivityReportData')).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });
});
