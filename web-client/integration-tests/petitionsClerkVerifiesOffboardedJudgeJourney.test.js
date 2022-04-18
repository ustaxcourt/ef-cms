import { advancedDocumentSearchHelper as advancedDocumentSearchComputed } from '../src/presenter/computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { caseDeadlineReportHelper as caseDeadlineReportComputed } from '../src/presenter/computeds/caseDeadlineReportHelper';
import { caseInventoryReportHelper as caseInventoryReportComputed } from '../src/presenter/computeds/caseInventoryReportHelper';
import { formattedPendingItems as formattedPendingItemsComputed } from '../src/presenter/computeds/formattedPendingItems';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueSectionHelper as workQueueSectionHelperComputed } from '../src/presenter/computeds/workQueueSectionHelper';

const cerebralTest = setupTest();

describe('Petitions clerk verifies offboarded judge journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const OFFBOARDED_JUDGE_NAMES = ['Guy'];

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

    it(`petitions clerk verifies judge ${judgeName} does not appear in the Create Message screen as a recipient`, async () => {
      const workQueueSection = withAppContextDecorator(
        workQueueSectionHelperComputed,
      );

      const workQueueSectionHelper = runCompute(workQueueSection, {
        state: cerebralTest.getState(),
      });

      expect(workQueueSectionHelper.chambersSections).not.toContain(judgeName);
    });

    // Remove "Guy" from the Judge's Name dropdown menu that appears when adding a Decision, Stipulated Decision, Order and Decision, and Order of Dismissal and Decision as a docket entry
    // Do not remove Judge Guy's name from any data currently associated with him

    // this requires giving it a trial session thing
    // it(`petitions clerk verifies judge ${judgeName} does not appear in the edit trial session judge drop down`, async () => {
    //   await cerebralTest.runSequence('gotoEditTrialSessionSequence');

    //   expect(cerebralTest.getState('judges')).not.toContain(judgeName);
    // });
  }
});
