import { formattedTrialSessionDetailsForFilteredEligibleCases } from './formattedTrialSessionDetailsForFilteredEligibleCases';
import { runCompute } from 'cerebral/test';

const testCases = [
  {
    caseCaption: 'testPetitioner1, Petitioner',
    caseTitle: 'testPetitioner1',
    caseType: 'CDP (Lien/Levy)',
    docketNumber: '103-20',
    docketNumberSuffix: 'L',
    docketNumberWithSuffix: '103-20L',
    entityName: 'EligibleCase',
    inConsolidatedGroup: false,
    irsPractitioners: [],
    isDocketSuffixHighPriority: true,
    leadCase: false,
    privatePractitioners: [],
    qcCompleteForTrial: {},
  },
  {
    caseCaption: 'testPetitioner2, Petitioner',
    caseTitle: 'testPetitioner2',
    caseType: 'Worker Classification',
    docketNumber: '108-19',
    docketNumberSuffix: null,
    docketNumberWithSuffix: '108-19',
    entityName: 'EligibleCase',
    inConsolidatedGroup: false,
    irsPractitioners: [],
    isDocketSuffixHighPriority: false,
    leadCase: false,
    privatePractitioners: [],
    qcCompleteForTrial: {},
  },
  {
    caseCaption: 'testPetitioner3, Petitioner',
    caseTitle: 'testPetitioner3',
    caseType: 'Deficiency',
    docketNumber: '101-20',
    docketNumberSuffix: 'S',
    docketNumberWithSuffix: '101-20S',
    entityName: 'EligibleCase',
    inConsolidatedGroup: false,
    irsPractitioners: [],
    isDocketSuffixHighPriority: true,
    leadCase: false,
    privatePractitioners: [],
    qcCompleteForTrial: {},
  },
  {
    caseCaption: 'testPetitioner4, Petitioner',
    caseTitle: 'testPetitioner4',
    caseType: 'CDP (Lien/Levy)',
    docketNumber: '110-20',
    docketNumberSuffix: 'SL',
    docketNumberWithSuffix: '110-20SL',
    entityName: 'EligibleCase',
    inConsolidatedGroup: false,
    irsPractitioners: [],
    isDocketSuffixHighPriority: true,
    leadCase: false,
    privatePractitioners: [],
    qcCompleteForTrial: {},
  },
];

jest.mock('./formattedEligibleCasesHelper', () => {
  return {
    __esModule: true,
    formattedEligibleCasesHelper: () => testCases,
  };
});

describe('formattedTrialSessionDetailsForFilteredEligibleCases', () => {
  it('should display all cases when filter is falsy', () => {
    const result = runCompute(
      formattedTrialSessionDetailsForFilteredEligibleCases,
      {
        state: {
          screenMetadata: {
            eligibleCasesFilter: {
              hybridSessionFilter: undefined,
            },
          },
        },
      },
    );

    expect(result).toHaveLength(testCases.length);
  });

  it('should display all small cases when filter is equal to Small', () => {
    const result = runCompute(
      formattedTrialSessionDetailsForFilteredEligibleCases,
      {
        state: {
          screenMetadata: {
            eligibleCasesFilter: {
              hybridSessionFilter: 'Small',
            },
          },
        },
      },
    );

    expect(result).toHaveLength(2);
    expect(result).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-20',
        }),
        expect.objectContaining({
          docketNumber: '110-20',
        }),
      ]),
    );
  });

  it('should display all regular cases when filter is equal to Regular', () => {
    const result = runCompute(
      formattedTrialSessionDetailsForFilteredEligibleCases,
      {
        state: {
          screenMetadata: {
            eligibleCasesFilter: {
              hybridSessionFilter: 'Regular',
            },
          },
        },
      },
    );

    expect(result).toHaveLength(2);
    expect(result).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '103-20',
        }),
        expect.objectContaining({
          docketNumber: '108-19',
        }),
      ]),
    );
  });
});
