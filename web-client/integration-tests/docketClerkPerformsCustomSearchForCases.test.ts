import { initialCustomCaseInventoryReportState } from '../src/presenter/customCaseInventoryReportState';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('Docket clerk performs custom searches for cases', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('navigates to the custom case report page', async () => {
    await cerebralTest.runSequence('gotoCustomCaseReportSequence');
    const customCaseReportState = cerebralTest.getState('customCaseInventory');
    expect(customCaseReportState).toEqual(
      initialCustomCaseInventoryReportState,
    );
  });

  it('should set custom case inventory filters in state', async () => {
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { endDate: '05/12/2023' },
    );

    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { startDate: '05/10/2023' },
    );
    // await cerebralTest.runSequence(
    //   'setCustomCaseInventoryReportFiltersSequence',
    //   { filingMethod: 'paper' },
    // );

    // const caseStatus: CaseStatus = CASE_STATUS_TYPES.rule155;
    // await cerebralTest.runSequence(
    //   'setCustomCaseInventoryReportFiltersSequence',
    //   { action: 'add', caseStatus },
    // );

    // const caseType: CaseType = CASE_TYPES_MAP.workerClassification;
    // await cerebralTest.runSequence(
    //   'setCustomCaseInventoryReportFiltersSequence',
    //   { action: 'add', caseType },
    // );
  });

  it('should run the custom case inventory report', async () => {
    await cerebralTest.runSequence('getCustomCaseInventoryReportSequence', {
      selectedPage: 0,
    });

    cerebralTest.getState('customCaseInventory');
  });
  // expectation of something in state, confirm initial state of custom case inventory

  // await cerebralTest.runSequence('serveCaseToIrsSequence');
});

// FLOW OF INTEGRATION TESTS
// ARRANGE: CREATE CASE WITH SPECIFIC QUERIABLE INFORMATION
// 1. NAVIGATE TO CUSTOM CASE REPORT
// 2. ADD VERY SPECIFIC FILTERS TO RETURN ONLY ONE CASE
// 3. MODIFY THE FILTERS AND RUN REPORT SO THAT NO CASES ARE RETURNED
