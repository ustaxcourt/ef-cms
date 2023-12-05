import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkStrikesDocketEntry } from './journey/docketClerkStrikesDocketEntry';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  describe('validation', () => {
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
      await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
        startDate: '--_--',
      });

      await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
        endDate: 'yabbadabaadooooo',
      });

      await cerebralTest.runSequence('submitJudgeActivityReportSequence', {
        selectedPage: 0,
      });

      expect(cerebralTest.getState('validationErrors')).toEqual({
        endDate: 'Enter a valid end date.',
        startDate: 'Enter a valid start date.',
      });
    });

    viewJudgeActivityReportResults(cerebralTest);
  });

  describe('CAV/Submitted cases', () => {
    it('should set the progressDescriptionTableBeforeCount', () => {
      progressDescriptionTableTotalBefore =
        cerebralTest.progressDescriptionTableTotal;
    });
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUpdatesCaseStatusTo(
      cerebralTest,
      CASE_STATUS_TYPES.cav,
      'Colvin',
    );

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUpdatesCaseStatusTo(
      cerebralTest,
      CASE_STATUS_TYPES.submitted,
      'Colvin',
    );

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUpdatesCaseStatusTo(
      cerebralTest,
      CASE_STATUS_TYPES.submittedRule122,
      'Colvin',
    );

    loginAs(cerebralTest, 'judgecolvin@example.com');
    viewJudgeActivityReportResults(cerebralTest, {});
    it('should increase progressDescriptionTableTotal by 3 when there is each of "CAV", "Submitted" and "Submitted - Rule 122" cases added', () => {
      const progressDescriptionTableTotalAfter =
        cerebralTest.progressDescriptionTableTotal;

      expect(progressDescriptionTableTotalAfter).toEqual(
        progressDescriptionTableTotalBefore + 3,
      );
    });

    viewJudgeActivityReportResults(cerebralTest);
  });

  describe('Regular case', () => {
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
  });

  describe('Served decision type event codes', () => {
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

  describe('Unserved decision type event codes', () => {
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

    loginAs(cerebralTest, 'judgecolvin@example.com');
    viewJudgeActivityReportResults(cerebralTest);
    it('should increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record and is not served', () => {
      const progressDescriptionTableTotalAfter =
        cerebralTest.progressDescriptionTableTotal;

      expect(progressDescriptionTableTotalAfter).toEqual(
        progressDescriptionTableTotalBefore + 1,
      );
    });
  });

  describe('Stricken decision type documents', () => {
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
    docketClerkAddsDocketEntryFromOrder(cerebralTest, 2, 'Colvin');
    docketClerkServesDocument(cerebralTest);
    docketClerkUpdatesCaseStatusTo(
      cerebralTest,
      CASE_STATUS_TYPES.submitted,
      'Colvin',
    );

    docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 7);
    docketClerkStrikesDocketEntry(cerebralTest, 7);

    loginAs(cerebralTest, 'judgecolvin@example.com');
    viewJudgeActivityReportResults(cerebralTest);
    it('should increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record and is not served', () => {
      const progressDescriptionTableTotalAfter =
        cerebralTest.progressDescriptionTableTotal;

      expect(progressDescriptionTableTotalAfter).toEqual(
        progressDescriptionTableTotalBefore + 1,
      );
    });
  });

  describe('Consolidated CAV cases', () => {
    it('should set the progressDescriptionTableBeforeCount', () => {
      progressDescriptionTableTotalBefore =
        cerebralTest.progressDescriptionTableTotal;
    });

    createConsolidatedGroup(
      cerebralTest,
      { caseStatus: CASE_STATUS_TYPES.cav },
      1,
    );

    loginAs(cerebralTest, 'judgecolvin@example.com');
    viewJudgeActivityReportResults(cerebralTest);
    it('should increase progressDescriptionTableTotal for the lead CAV case in a consolidated group', () => {
      const progressDescriptionTableTotalAfter =
        cerebralTest.progressDescriptionTableTotal;

      // expect only one new case (member cases should not appear on report)
      expect(progressDescriptionTableTotalAfter).toEqual(
        progressDescriptionTableTotalBefore + 1,
      );
    });
  });
});
