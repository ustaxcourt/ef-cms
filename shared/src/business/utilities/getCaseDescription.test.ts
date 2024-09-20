import { getCaseDescription } from '@shared/business/utilities/getCaseDescription';

const caseTypesWithIrsNotice = [
  {
    description: 'Notice of Deficiency',
    type: 'Deficiency',
  },
  {
    description: 'Notice of Determination Concerning Collection Action',
    type: 'CDP (Lien/Levy)',
  },
  {
    description: 'Other',
    type: 'Other',
  },
  {
    description: 'Adjustment of Partnership Items Code Section 6228',
    type: 'Partnership (Section 6228)',
  },
  {
    description:
      'Notice - We Are Going To Make Your Determination Letter Available for Public Inspection',
    type: 'Disclosure2',
  },
  {
    description:
      'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
    type: 'Passport',
  },
  {
    description:
      'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
    type: 'Innocent Spouse',
  },
  {
    description: 'Notice of Determination of Worker Classification',
    type: 'Worker Classification',
  },
  {
    description:
      'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
    type: 'Whistleblower',
  },
  {
    description:
      'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim',
    type: 'Interest Abatement',
  },
  {
    description: 'Notice of Intention to Disclose',
    type: 'Disclosure1',
  },
  {
    description: 'Partnership Action Under BBA Section 1101',
    type: 'Partnership (BBA Section 1101)',
  },
  {
    description: 'Readjustment of Partnership Items Code Section 6226',
    type: 'Partnership (Section 6226)',
  },
];

const caseTypesWithoutIrsNotice = [
  { description: 'Deficiency', type: 'Deficiency' },
  { description: 'Collection (Lien/Levy)', type: 'CDP (Lien/Levy)' },
  { description: 'Passport', type: 'Passport' },
  { description: 'Innocent Spouse', type: 'Innocent Spouse' },
  { description: 'Whistleblower', type: 'Whistleblower' },
  { description: 'Worker Classification', type: 'Worker Classification' },
  {
    description: 'Declaratory Judgment (Retirement Plan)',
    type: 'Declaratory Judgment (Retirement Plan)',
  },
  {
    description: 'Declaratory Judgment (Exempt Organization)',
    type: 'Declaratory Judgment (Exempt Organization)',
  },
  { description: 'Disclosure', type: 'Disclosure' },
  {
    description:
      'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement',
    type: 'Interest Abatement',
  },
  { description: 'Other', type: 'Other' },
];

describe('getCaseDescription', () => {
  describe('With IRS notices', () => {
    const hasIrsNotice = true;
    caseTypesWithIrsNotice.forEach(caseType => {
      it(`should return case description for ${caseType.type}`, () => {
        const caseDescription = getCaseDescription(hasIrsNotice, caseType.type);
        expect(caseDescription).toEqual(caseType.description);
      });
    });
  });

  describe('Without IRS notices', () => {
    const hasIrsNotice = false;
    caseTypesWithoutIrsNotice.forEach(caseType => {
      it(`should return case description for ${caseType.type}`, () => {
        const caseDescription = getCaseDescription(hasIrsNotice, caseType.type);
        expect(caseDescription).toEqual(caseType.description);
      });
    });
  });
});
