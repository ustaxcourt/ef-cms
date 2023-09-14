import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseTypeDescriptionHelper as caseTypeDescriptionHelperComputed } from './caseTypeDescriptionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseTypeDescriptionHelper = withAppContextDecorator(
  caseTypeDescriptionHelperComputed,
);

const { CASE_TYPES_MAP } = applicationContext.getConstants();

describe('caseTypeDescriptionHelper', () => {
  it('should return case types with proper descriptions for hasIrsNotice true', () => {
    const result = runCompute(caseTypeDescriptionHelper, {
      state: {
        form: { hasIrsNotice: true },
      },
    });
    expect(result).toMatchObject({
      caseTypes: [
        {
          description: 'Notice of Determination Concerning Collection Action',
          type: CASE_TYPES_MAP.cdp,
        },
        {
          description: 'Notice of Deficiency',
          type: CASE_TYPES_MAP.deficiency,
        },
        {
          description:
            'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
          type: CASE_TYPES_MAP.innocentSpouse,
        },
        {
          description:
            'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim',
          type: CASE_TYPES_MAP.interestAbatement,
        },
        {
          description: 'Other',
          type: CASE_TYPES_MAP.other,
        },
        {
          description: 'Partnership Action Under BBA Section 1101',
          type: CASE_TYPES_MAP.partnershipSection1101,
        },
        {
          description: 'Readjustment of Partnership Items Code Section 6226',
          type: CASE_TYPES_MAP.partnershipSection6226,
        },
        {
          description: 'Adjustment of Partnership Items Code Section 6228',
          type: CASE_TYPES_MAP.partnershipSection6228,
        },
        {
          description:
            'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
          type: CASE_TYPES_MAP.passport,
        },
        {
          description:
            'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
          type: CASE_TYPES_MAP.whistleblower,
        },
        {
          description: 'Notice of Determination of Worker Classification',
          type: CASE_TYPES_MAP.workerClassification,
        },
        {
          description: 'Notice of Intention to Disclose',
          type: 'Disclosure1',
        },

        {
          description:
            'Notice - We Are Going To Make Your Determination Letter Available for Public Inspection',
          type: 'Disclosure2',
        },
      ],
    });
  });

  it('should return case types with proper descriptions for hasIrsNotice false', () => {
    const result = runCompute(caseTypeDescriptionHelper, {
      state: {
        form: { hasIrsNotice: false },
      },
    });
    expect(result).toMatchObject({
      caseTypes: [
        {
          description: 'CDP (Lien/Levy)',
          type: CASE_TYPES_MAP.cdp,
        },
        {
          description: 'Declaratory Judgment (Exempt Organization)',
          type: CASE_TYPES_MAP.djExemptOrg,
        },
        {
          description: 'Declaratory Judgment (Retirement Plan)',
          type: CASE_TYPES_MAP.djRetirementPlan,
        },
        {
          description: 'Disclosure',
          type: CASE_TYPES_MAP.disclosure,
        },
        {
          description: 'Innocent Spouse',
          type: CASE_TYPES_MAP.innocentSpouse,
        },
        {
          description:
            'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement',
          type: CASE_TYPES_MAP.interestAbatement,
        },
        {
          description: 'Other',
          type: CASE_TYPES_MAP.other,
        },
        {
          description: 'Whistleblower',
          type: CASE_TYPES_MAP.whistleblower,
        },
        {
          description: 'Worker Classification',
          type: CASE_TYPES_MAP.workerClassification,
        },
      ],
    });
  });
});
