import { advancedDocumentSearchHelper as advancedDocumentSearchComputed } from '../src/presenter/computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { caseDeadlineReportHelper as caseDeadlineReportComputed } from '../src/presenter/computeds/caseDeadlineReportHelper';
import { caseInventoryReportHelper as caseInventoryReportComputed } from '../src/presenter/computeds/caseInventoryReportHelper';
import { formattedPendingItems as formattedPendingItemsComputed } from '../src/presenter/computeds/formattedPendingItems';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueSectionHelper as workQueueSectionHelperComputed } from '../src/presenter/computeds/workQueueSectionHelper';

describe('Petitions clerk verifies offboarded judge journey', () => {
  const cerebralTest = setupTest();

  const OFFBOARDED_JUDGE_NAMES = ['Guy'];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  for (const judgeName of OFFBOARDED_JUDGE_NAMES) {
    it(`petitions clerk verifies judge ${judgeName} still appears in the advanced document search judge filter`, () => {
      const advancedDocumentSearch = withAppContextDecorator(
        advancedDocumentSearchComputed,
      );

      const advancedDocumentSearchHelper = runCompute(advancedDocumentSearch, {
        state: cerebralTest.getState(),
      });

      expect(advancedDocumentSearchHelper.formattedJudges).not.toContain(
        judgeName,
      );
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the deadlines report judge dropdown`, () => {
      const caseDeadlineReport = withAppContextDecorator(
        caseDeadlineReportComputed,
      );

      const caseDeadlineReportHelper = runCompute(caseDeadlineReport, {
        state: cerebralTest.getState(),
      });

      expect(caseDeadlineReportHelper.judges).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the case inventory report judge dropdown`, () => {
      const caseInventoryReport = withAppContextDecorator(
        caseInventoryReportComputed,
      );

      const caseInventoryReportHelper = runCompute(caseInventoryReport, {
        state: cerebralTest.getState(),
      });

      expect(caseInventoryReportHelper.judges).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the pending report judge dropdown`, () => {
      const formattedPendingItems = withAppContextDecorator(
        formattedPendingItemsComputed,
      );

      const formattedPendingItemsHelper = runCompute(formattedPendingItems, {
        state: cerebralTest.getState(),
      });

      expect(formattedPendingItemsHelper.judges).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the add trial session judge drop down`, async () => {
      await cerebralTest.runSequence('gotoAddTrialSessionSequence');

      expect(cerebralTest.getState('judges')).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the Create Message screen as a recipient`, () => {
      const workQueueSection = withAppContextDecorator(
        workQueueSectionHelperComputed,
      );

      const workQueueSectionHelper = runCompute(workQueueSection, {
        state: cerebralTest.getState(),
      });

      expect(workQueueSectionHelper.chambersSections).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the edit trial session judge drop down`, async () => {
      await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

      expect(cerebralTest.getState('judges')).not.toContain(judgeName);
    });
  }
});
