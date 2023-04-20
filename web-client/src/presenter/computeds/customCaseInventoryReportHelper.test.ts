import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { customCaseInventoryReportHelper as customCaseInventoryReportHelperComputed } from './customCaseInventoryReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const customCaseInventoryReportHelper = withAppContextDecorator(
  customCaseInventoryReportHelperComputed,
  applicationContext,
);

const cases = [
  {
    ...MOCK_CASE,
    associatedJudge: 'Chief Judge',
    caseType: 'New',
    createdAt: '2018-03-01T21:40:46.415Z',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
  },
  {
    ...MOCK_CASE,
    associatedJudge: 'Judge Currozo',
    caseType: 'Deficiency',
    createdAt: '2022-03-01T21:40:46.415Z',
    docketNumber: '1338-20',
    preferredTrialCity: 'Birmingham, Alabama',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.generalDocket,
  },
];

describe('customCaseInventoryReportHelper', () => {
  it('should format case statuses', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
      },
    });

    const expectedResult = [
      { label: 'Assigned - Case', value: 'Assigned - Case' },
      { label: 'Assigned - Motion', value: 'Assigned - Motion' },
      { label: 'Calendared', value: 'Calendared' },
      { label: 'CAV', value: 'CAV' },
      { label: 'Closed', value: 'Closed' },
      { label: 'Closed - Dismissed', value: 'Closed - Dismissed' },
      {
        label: 'General Docket - Not at Issue',
        value: 'General Docket - Not at Issue',
      },
      {
        label: 'General Docket - At Issue (Ready for Trial)',
        value: 'General Docket - At Issue (Ready for Trial)',
      },
      { label: 'Jurisdiction Retained', value: 'Jurisdiction Retained' },
      { label: 'New', value: 'New' },
      { label: 'On Appeal', value: 'On Appeal' },
      { label: 'Rule 155', value: 'Rule 155' },
      { label: 'Submitted', value: 'Submitted' },
    ];

    expect(result.caseStatuses).toEqual(expectedResult);
  });

  it('should format case types', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
      },
    });

    const expectedResult = [
      { label: 'CDP (Lien/Levy)', value: 'CDP (Lien/Levy)' },
      { label: 'Deficiency', value: 'Deficiency' },
      {
        label: 'Declaratory Judgment (Exempt Organization)',
        value: 'Declaratory Judgment (Exempt Organization)',
      },
      {
        label: 'Declaratory Judgment (Retirement Plan)',
        value: 'Declaratory Judgment (Retirement Plan)',
      },
      { label: 'Disclosure', value: 'Disclosure' },
      { label: 'Innocent Spouse', value: 'Innocent Spouse' },
      { label: 'Interest Abatement', value: 'Interest Abatement' },
      { label: 'Other', value: 'Other' },
      {
        label: 'Partnership (BBA Section 1101)',
        value: 'Partnership (BBA Section 1101)',
      },
      {
        label: 'Partnership (Section 6226)',
        value: 'Partnership (Section 6226)',
      },
      {
        label: 'Partnership (Section 6228)',
        value: 'Partnership (Section 6228)',
      },
      { label: 'Passport', value: 'Passport' },
      { label: 'Whistleblower', value: 'Whistleblower' },
      { label: 'Worker Classification', value: 'Worker Classification' },
    ];

    expect(result.caseTypes).toEqual(expectedResult);
  });

  it('should generated generate cases with formatted dates', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
        customCaseInventoryReportData: {
          foundCases: cases,
        },
      },
    });

    expect(result.customCaseInventoryReportData).toMatchObject([
      {
        associatedJudge: 'Chief Judge',
        caseType: 'New',
        createdAt: '03/01/18',
        docketNumber: '101-18',
        preferredTrialCity: 'Washington, District of Columbia',
        status: CASE_STATUS_TYPES.new,
      },
      {
        associatedJudge: 'Judge Currozo',
        caseType: 'Deficiency',
        createdAt: '03/01/22',
        docketNumber: '1338-20',
        preferredTrialCity: 'Birmingham, Alabama',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ]);
  });

  it('should return false for isRunReportButtonDisabled if originalCreatedEndDate and originalCreatedStartDate are both falsy', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          originalCreatedEndDate: 's',
          originalCreatedStartDate: undefined,
        },
      },
    });

    expect(result.isRunReportButtonDisabled).toEqual(true);
  });
  it('should return true for isRunReportButtonDisabled if originalCreatedEndDate and originalCreatedStartDate are both truthy', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          originalCreatedEndDate: 'truthy',
          originalCreatedStartDate: 'truthy',
        },
      },
    });

    expect(result.isRunReportButtonDisabled).toEqual(false);
  });
});
