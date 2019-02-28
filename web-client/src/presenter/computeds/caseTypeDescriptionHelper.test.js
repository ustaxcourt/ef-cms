import { runCompute } from 'cerebral/test';

import { caseTypeDescriptionHelper } from './caseTypeDescriptionHelper';

describe('caseTypeDescriptionHelper', () => {
  it('should return case types with proper descriptions for hasIrsNotice true', async () => {
    const result = await runCompute(caseTypeDescriptionHelper, {
      state: {
        caseTypes: [
          'Deficiency',
          'CDP (Lien/Levy)',
          'Innocent Spouse',
          'Partnership (Section 6226)',
          'Partnership (Section 6228)',
          'Partnership (BBA Section 1101)',
          'Whistleblower',
          'Worker Classification',
          'Declaratory Judgment (Retirement Plan)',
          'Declaratory Judgment (Exempt Organization)',
          'Passport',
          'Interest Abatement',
          'Other',
        ],
        form: { hasIrsNotice: true },
      },
    });
    expect(result).toMatchObject({
      caseTypes: [
        { type: 'Deficiency', description: 'Notice of Deficiency' },
        {
          type: 'CDP (Lien/Levy)',
          description: 'Notice of Determination Concerning Collection Action',
        },
        {
          type: 'Innocent Spouse',
          description:
            'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
        },
        {
          type: 'Partnership (Section 6226)',
          description: 'Readjustment of Partnership Items Code Section 6226',
        },
        {
          type: 'Partnership (Section 6228)',
          description: 'Adjustment of Partnership Items Code Section 6228',
        },
        {
          type: 'Partnership (BBA Section 1101)',
          description: 'Partnership Action Under BBA Section 1101',
        },
        {
          type: 'Whistleblower',
          description:
            'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
        },
        {
          type: 'Worker Classification',
          description: 'Notice of Determination of Worker Classification',
        },
        {
          type: 'Declaratory Judgment (Retirement Plan)',
          description: 'Declaratory Judgment (Retirement Plan)',
        },
        {
          type: 'Declaratory Judgment (Exempt Organization)',
          description: 'Declaratory Judgment (Exempt Organization)',
        },
        {
          type: 'Passport',
          description:
            'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
        },
        {
          type: 'Interest Abatement',
          description:
            'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim',
        },
        {
          type: 'Other',
          description: 'Other',
        },
      ],
    });
  });

  it('should return case types with proper descriptions for hasIrsNotice false', async () => {
    const result = await runCompute(caseTypeDescriptionHelper, {
      state: {
        caseTypes: [
          'Deficiency',
          'CDP (Lien/Levy)',
          'Innocent Spouse',
          'Partnership (Section 6226)',
          'Partnership (Section 6228)',
          'Partnership (BBA Section 1101)',
          'Whistleblower',
          'Worker Classification',
          'Declaratory Judgment (Retirement Plan)',
          'Declaratory Judgment (Exempt Organization)',
          'Passport',
          'Interest Abatement',
          'Other',
        ],
        form: { hasIrsNotice: false },
      },
    });
    expect(result).toMatchObject({
      caseTypes: [
        { type: 'Deficiency', description: 'Deficiency' },
        {
          type: 'CDP (Lien/Levy)',
          description: 'CDP (Lien/Levy)',
        },
        {
          type: 'Innocent Spouse',
          description: 'Innocent Spouse',
        },
        {
          type: 'Whistleblower',
          description: 'Whistleblower',
        },
        {
          type: 'Worker Classification',
          description: 'Worker Classification',
        },
        {
          type: 'Declaratory Judgment (Retirement Plan)',
          description: 'Declaratory Judgment (Retirement Plan)',
        },
        {
          type: 'Declaratory Judgment (Exempt Organization)',
          description: 'Declaratory Judgment (Exempt Organization)',
        },
        {
          type: 'Interest Abatement',
          description:
            'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement',
        },
        {
          type: 'Other',
          description: 'Other',
        },
      ],
    });
  });
});
