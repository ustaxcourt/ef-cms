import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CaseStatus,
  CaseType,
} from '../../shared/src/business/entities/EntityConstants';
import {
  CustomCaseReportState,
  initialCustomCaseReportState,
} from '../src/presenter/customCaseReportState';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('Docket clerk runs custom case report', () => {
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
    const customCaseReportState = cerebralTest.getState('customCaseReport');
    expect(customCaseReportState).toEqual(initialCustomCaseReportState);
  });

  it('should not get custom case report when the startDate and endDate are invalid', async () => {
    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      startDate: 'blegh',
    });
    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      endDate: '',
    });

    await cerebralTest.runSequence('getCustomCaseReportSequence', {
      selectedPage: 0,
    });

    const validationErrors = cerebralTest.getState('validationErrors');
    expect(validationErrors).toEqual({
      startDate: 'Enter date in format MM/DD/YYYY.',
    });
  });

  it('should set custom case filters in state', async () => {
    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      startDate: '02/28/2012',
    });

    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      endDate: '03/01/2012',
    });

    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      filingMethod: 'paper',
    });

    const caseStatus: CaseStatus = CASE_STATUS_TYPES.new;
    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      action: 'add',
      caseStatus,
    });

    const caseType: CaseType = CASE_TYPES_MAP.deficiency;
    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      action: 'add',
      caseType,
    });

    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      procedureType: 'All',
    });

    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      action: 'add',
      judge: 'Chief Judge',
    });

    await cerebralTest.runSequence('setCustomCaseReportFiltersSequence', {
      action: 'add',
      preferredTrialCity: 'Birmingham, Alabama',
    });
  });

  it('should run the custom case report', async () => {
    await cerebralTest.runSequence('getCustomCaseReportSequence', {
      selectedPage: 0,
    });

    const customCaseReportState: CustomCaseReportState =
      cerebralTest.getState('customCaseReport');
    const foundCase = customCaseReportState.cases.find(
      case1 => case1.docketNumber === createdDocketNumber,
    );
    expect(foundCase!.docketNumber).toEqual(createdDocketNumber);
  });
});
