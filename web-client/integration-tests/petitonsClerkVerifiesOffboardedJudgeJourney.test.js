import { advancedDocumentSearchHelper as advancedDocumentSearchComputed } from '../src/presenter/computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { caseDeadlineReportHelper as caseDeadlineReportComputed } from '../src/presenter/computeds/caseDeadlineReportHelper';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const advancedDocumentSearch = withAppContextDecorator(
  advancedDocumentSearchComputed,
);

const caseDeadlineReport = withAppContextDecorator(caseDeadlineReportComputed);

const cerebralTest = setupTest();

describe('Petitions clerk verifies fffboarded judge journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const OFFBOARDED_JUDGE_NAMES = ['Guy'];

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  for (const judgeName of OFFBOARDED_JUDGE_NAMES) {
    it(`petitions clerk verifies judge ${judgeName} still appears in the advanced document search judge filter`, async () => {
      const advancedDocumentSearchHelper = runCompute(advancedDocumentSearch, {
        state: cerebralTest.getState(),
      });

      expect(advancedDocumentSearchHelper.formattedJudges).not.toContain(
        judgeName,
      );
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the add docket entry judge dropdown`, async () => {
      const caseDeadlineReportHelper = runCompute(caseDeadlineReport, {
        state: cerebralTest.getState(),
      });

      expect(caseDeadlineReportHelper.judges).not.toContain(judgeName);
    });

    it(`petitions clerk verifies judge ${judgeName} does not appear in the add/edit trial session judge drop down`, async () => {
      await cerebralTest.runSequence('gotoAddTrialSessionSequence');

      expect(cerebralTest.getState('judges')).not.toContain(judgeName);
    });
  }
});
