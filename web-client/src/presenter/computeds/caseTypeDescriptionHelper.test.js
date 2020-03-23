import { caseTypeDescriptionHelper as caseTypeDescriptionHelperComputed } from './caseTypeDescriptionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseTypeDescriptionHelper = withAppContextDecorator(
  caseTypeDescriptionHelperComputed,
);

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
          type: 'CDP (Lien/Levy)',
        },
        { description: 'Notice of Deficiency', type: 'Deficiency' },
        {
          description:
            'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
          type: 'Innocent Spouse',
        },
        {
          description:
            'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim',
          type: 'Interest Abatement',
        },
        {
          description: 'Other',
          type: 'Other',
        },
        {
          description: 'Partnership Action Under BBA Section 1101',
          type: 'Partnership (BBA Section 1101)',
        },
        {
          description: 'Readjustment of Partnership Items Code Section 6226',
          type: 'Partnership (Section 6226)',
        },
        {
          description: 'Adjustment of Partnership Items Code Section 6228',
          type: 'Partnership (Section 6228)',
        },
        {
          description:
            'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
          type: 'Passport',
        },
        {
          description:
            'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
          type: 'Whistleblower',
        },
        {
          description: 'Notice of Determination of Worker Classification',
          type: 'Worker Classification',
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
          type: 'CDP (Lien/Levy)',
        },
        {
          description: 'Declaratory Judgment (Exempt Organization)',
          type: 'Declaratory Judgment (Exempt Organization)',
        },
        {
          description: 'Declaratory Judgment (Retirement Plan)',
          type: 'Declaratory Judgment (Retirement Plan)',
        },
        {
          description: 'Innocent Spouse',
          type: 'Innocent Spouse',
        },
        {
          description:
            'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement',
          type: 'Interest Abatement',
        },
        {
          description: 'Other',
          type: 'Other',
        },
        {
          description: 'Whistleblower',
          type: 'Whistleblower',
        },
        {
          description: 'Worker Classification',
          type: 'Worker Classification',
        },
      ],
    });
  });
});
