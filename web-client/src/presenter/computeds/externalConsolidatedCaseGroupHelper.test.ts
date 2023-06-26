import {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { externalConsolidatedCaseGroupHelper as externalConsolidatedCaseGroupHelperComputed } from './externalConsolidatedCaseGroupHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const { CONTACT_TYPES, USER_ROLES } = applicationContext.getConstants();

const testIrsPractitioners = [
  { name: 'Iron Man', role: USER_ROLES.irsPractitioner },
  { name: 'Winter Soldier', role: USER_ROLES.irsPractitioner },
];
const testPrivatePractitioners = [
  { name: 'Luke Skywalker', role: USER_ROLES.privatePractitioner },
];
const testPetitioners1 = [
  { contactType: CONTACT_TYPES.petitioner, name: 'Princess Leia' },
  { contactType: CONTACT_TYPES.petitioner, name: 'Hans Solo' },
];

const testPetitioners2 = [
  { contactType: CONTACT_TYPES.petitioner, name: 'Will Riker' },
  { contactType: CONTACT_TYPES.petitioner, name: 'Deana Troi' },
];

const mockMemberCase = {
  ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  irsPractitioners: testIrsPractitioners,
  petitioners: testPetitioners1,
  privatePractitioners: testPrivatePractitioners,
};

const mockLeadCase = {
  ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
  irsPractitioners: [],
  petitioners: testPetitioners2,
  privatePractitioners: [],
};

const mockSealedCase = {
  docketNumber: '300-23',
  hasIrsPractitioner: false,
  isSealed: true,
};

const testCase = {
  ...mockMemberCase,
  consolidatedCases: [mockLeadCase, mockMemberCase],
};

const unconsolidatedCase = {
  ...mockMemberCase,
  consolidatedCases: undefined,
  leadDocketNumber: undefined,
};

let state = {};

const externalConsolidatedCaseGroupHelper = withAppContextDecorator(
  externalConsolidatedCaseGroupHelperComputed,
  applicationContext,
);

describe('externalConsolidatedCaseGroupHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: testCase,
    };
  });

  it('should return formattedCurrentCasePetitionerNames undefined and empty arrays for consolidatedGroupServiceParties and  formattedConsolidatedCaseList when a consolidated case is not on state', () => {
    state = {
      caseDetail: unconsolidatedCase,
    };

    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.formattedCurrentCasePetitionerNames).toBeUndefined();
    expect(results.consolidatedGroupServiceParties).toEqual([]);
    expect(results.formattedConsolidatedCaseList).toEqual([]);
  });

  it('should return formattedCurrentCasePetitionerNames when a consolidated case is on state', () => {
    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.formattedCurrentCasePetitionerNames).toEqual(
      `${testCase.docketNumber} ${testCase.petitioners[0].name} & ${testCase.petitioners[1].name}`,
    );
  });

  it('should return consolidatedGroupServiceParties when a consolidated case is on state', () => {
    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.consolidatedGroupServiceParties).toEqual([
      [
        `${testCase.consolidatedCases[0].petitioners[0].name}, Petitioner`,
        `${testCase.consolidatedCases[0].petitioners[1].name}, Petitioner`,
      ],
      [
        `${testCase.consolidatedCases[1].petitioners[0].name}, Petitioner`,
        `${testCase.consolidatedCases[1].petitioners[1].name}, Petitioner`,
        `${testCase.consolidatedCases[1].privatePractitioners[0].name}, Petitioner Counsel`,
        `${testCase.consolidatedCases[1].irsPractitioners[0].name}, Respondent Counsel`,
        `${testCase.consolidatedCases[1].irsPractitioners[1].name}, Respondent Counsel`,
      ],
    ]);
  });

  it('should return `Sealed Case` instead of petitioner names in consolidatedGroupServiceParties when a sealed case is in the list of consolidated cases', () => {
    state = {
      caseDetail: {
        ...testCase,
        consolidatedCases: [mockSealedCase, mockMemberCase],
      },
    };

    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.consolidatedGroupServiceParties).toEqual([
      ['Sealed Case'],
      [
        `${testCase.consolidatedCases[1].petitioners[0].name}, Petitioner`,
        `${testCase.consolidatedCases[1].petitioners[1].name}, Petitioner`,
        `${testCase.consolidatedCases[1].privatePractitioners[0].name}, Petitioner Counsel`,
        `${testCase.consolidatedCases[1].irsPractitioners[0].name}, Respondent Counsel`,
        `${testCase.consolidatedCases[1].irsPractitioners[1].name}, Respondent Counsel`,
      ],
    ]);
  });

  it('should return formattedConsolidatedCaseList when a consolidated case is on state', () => {
    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.formattedConsolidatedCaseList).toEqual(
      expect.arrayContaining([
        `${testCase.docketNumber} ${testCase.petitioners[0].name} & ${testCase.petitioners[1].name}`,
        `${testCase.consolidatedCases[0].docketNumber} ${testCase.consolidatedCases[0].petitioners[0].name} & ${testCase.consolidatedCases[0].petitioners[1].name}`,
      ]),
    );
  });

  it('should return `Sealed Case` instead of petitioner names in formattedConsolidatedCaseList for sealed cases', () => {
    state = {
      caseDetail: {
        ...testCase,
        consolidatedCases: [mockSealedCase, mockMemberCase],
      },
    };
    const results: any = runCompute(externalConsolidatedCaseGroupHelper, {
      state,
    });

    expect(results.formattedConsolidatedCaseList).toEqual(
      expect.arrayContaining([
        `${testCase.docketNumber} ${testCase.petitioners[0].name} & ${testCase.petitioners[1].name}`,
        `${mockSealedCase.docketNumber} Sealed Case`,
      ]),
    );
  });
});
