import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CaseStatus,
  CaseType,
} from '../../shared/src/business/entities/EntityConstants';
import {
  CustomCaseInventoryReportState,
  initialCustomCaseInventoryReportState,
} from '../src/presenter/customCaseInventoryReportState';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('Docket clerk runs custom case inventory report', () => {
  const cerebralTest = setupTest();
  let createdDocketNumber: string;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    receivedAtDay: '29',
    receivedAtMonth: '02',
    receivedAtYear: '2012',
  });

  it('should capture the new cases docket number', () => {
    createdDocketNumber = cerebralTest.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('navigates to the custom case report page', async () => {
    await cerebralTest.runSequence('gotoCustomCaseReportSequence');
    const customCaseReportState = cerebralTest.getState('customCaseInventory');
    expect(customCaseReportState).toEqual(
      initialCustomCaseInventoryReportState,
    );
  });

  it('should not get custom case report when the startDate and endDate are invalid', async () => {
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { startDate: 'blegh' },
    );
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { endDate: '' },
    );

    await cerebralTest.runSequence('getCustomCaseInventoryReportSequence', {
      selectedPage: 0,
    });

    const validationErrors = cerebralTest.getState('validationErrors');
    expect(validationErrors).toEqual({
      endDate: 'Enter an end date.',
      startDate: 'Enter a valid start date.',
    });
  });

  it('should set custom case inventory filters in state', async () => {
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { startDate: '02/28/2012' },
    );

    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { endDate: '03/01/2012' },
    );

    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { filingMethod: 'paper' },
    );

    const caseStatus: CaseStatus = CASE_STATUS_TYPES.new;
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { action: 'add', caseStatus },
    );

    const caseType: CaseType = CASE_TYPES_MAP.deficiency;
    await cerebralTest.runSequence(
      'setCustomCaseInventoryReportFiltersSequence',
      { action: 'add', caseType },
    );
  });

  it('should run the custom case inventory report', async () => {
    await cerebralTest.runSequence('getCustomCaseInventoryReportSequence', {
      selectedPage: 0,
    });

    const customCaseInventoryState: CustomCaseInventoryReportState =
      cerebralTest.getState('customCaseInventory');
    const foundCase = customCaseInventoryState.cases.find(
      case1 => case1.docketNumber === createdDocketNumber,
    );
    expect(foundCase!.docketNumber).toEqual(createdDocketNumber);
  });
});
