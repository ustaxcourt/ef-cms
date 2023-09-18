/* eslint-disable max-lines */

import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedEligibleCasesHelper as formattedEligibleCasesHelperComputed } from './formattedEligibleCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedEligibleCasesHelper', () => {
  const MOCK_ELIGIBLE_CASES = [
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
      isLeadCase: false,
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
      isLeadCase: false,
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
      isLeadCase: false,
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
      isLeadCase: false,
      privatePractitioners: [],
      qcCompleteForTrial: {},
    },
  ];

  const TRIAL_SESSION = {
    caseOrder: [],
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    judge: { name: 'Test Judge' },
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: { name: 'Test Trial Clerk' },
    trialLocation: 'Hartford, Connecticut',
  };

  const formattedEligibleCasesHelper = withAppContextDecorator(
    formattedEligibleCasesHelperComputed,
    applicationContext,
  );

  it('formats docket numbers with suffixes and case caption names without postfix on eligible cases', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          eligibleCases: [
            MOCK_CASE,
            {
              ...MOCK_CASE,
              caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '101-18W',
            },
            {
              ...MOCK_CASE,
              caseCaption: undefined,
              docketNumber: '103-19',
              docketNumberWithSuffix: '103-19',
            },
            {
              ...MOCK_CASE,
              caseCaption: 'Marky Mark and The Funky Bunch, Petitioners',
              docketNumber: '799-19',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
              docketNumberWithSuffix: '799-19L', // high priority
            },
            {
              ...MOCK_CASE,
              caseCaption: 'Bob Dylan and the Traveling Wilburys, Petitioners',
              docketNumber: '122-20',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
              docketNumberWithSuffix: '122-20P', // high priority
            },
          ],
        },
      },
    });

    expect(result.length).toEqual(5);
    expect(result).toMatchObject([
      {
        caseCaption: 'Marky Mark and The Funky Bunch, Petitioners',
        docketNumber: '799-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        docketNumberWithSuffix: '799-19L',
        isDocketSuffixHighPriority: true,
      },
      {
        caseCaption: 'Bob Dylan and the Traveling Wilburys, Petitioners',
        docketNumber: '122-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
        docketNumberWithSuffix: '122-20P',
        isDocketSuffixHighPriority: true,
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '101-18',
      },
      {
        caseTitle: 'Daenerys Stormborn & Someone Else',
        docketNumberWithSuffix: '101-18W',
      },
      {
        caseTitle: '',
        docketNumberWithSuffix: '103-19',
      },
    ]);
  });

  it('compares eligible trial session cases sorting passport first', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '102-19',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '102-19',
              isDocketSuffixHighPriority: false,
            },
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'P',
              docketNumberWithSuffix: '101-19P',
              isDocketSuffixHighPriority: true,
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([
      {
        docketNumber: '101-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '101-19P',
        isDocketSuffixHighPriority: true,
      },
      {
        docketNumber: '102-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '102-19',
      },
    ]);
  });

  it('compares eligible trial session cases sorting manually added cases first', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '105-19',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '105-19',
            },
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'L',
              docketNumberWithSuffix: '101-19L',
            },
            {
              docketNumber: '103-19',
              docketNumberSuffix: 'P',
              docketNumberWithSuffix: '103-19P',
              isManuallyAdded: true,
            },
            {
              docketNumber: '104-19',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '104-19',
              highPriority: true,
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([
      {
        docketNumber: '103-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '103-19P',
        isManuallyAdded: true,
      },
      {
        docketNumber: '104-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '104-19',
        highPriority: true,
      },
      {
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '101-19L',
      },
      {
        docketNumber: '105-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '105-19',
      },
    ]);
  });

  it('groups consolidated cases together for display', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '103-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
            },
            {
              docketNumber: '107-22',
              highPriority: true,
            },
            {
              docketNumber: '108-22',
              isManuallyAdded: true,
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
    ]);
  });

  it('groups consolidated cases together for display when consolidated groups are out of order', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '106-22',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              docketNumberWithSuffix: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '103-22',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '103-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
              docketNumberWithSuffix: '105-22',
            },
            {
              docketNumber: '107-22',
              docketNumberSuffix: 'P',
              docketNumberWithSuffix: '107-22P',
              highPriority: true,
            },
            {
              docketNumber: '108-22',
              docketNumberSuffix: 'P',
              docketNumberWithSuffix: '108-22P',
              isManuallyAdded: true,
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
    ]);
  });

  it('groups two separate consolidated cases correctly', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '105-21',
              isManuallyAdded: true,
              leadDocketNumber: '103-21',
            },
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '103-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '103-21',
              leadDocketNumber: '103-21',
            },
            {
              docketNumber: '105-23',
            },
            {
              docketNumber: '107-22',
              highPriority: true,
            },
            {
              docketNumber: '108-22',
              isManuallyAdded: true,
            },
            {
              docketNumber: '104-21',
              leadDocketNumber: '103-21',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '105-21',
      }),
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '103-21',
      }),
      expect.objectContaining({
        docketNumber: '104-21',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-23',
      }),
    ]);
  });

  it('groups the cases correctly when the eligible lead case is not in the list', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
            },
            {
              docketNumber: '107-22',
              highPriority: true,
            },
            {
              docketNumber: '108-22',
              isManuallyAdded: true,
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '108-22',
      }),
      expect.objectContaining({
        docketNumber: '107-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should group the consolidated cases together when the lead and a member case is high priority', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '103-22',
              highPriority: true,
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
              highPriority: true,
            },
            {
              docketNumber: '106-22',
              highPriority: true,
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '120-22',
            },
            {
              docketNumber: '110-22',
              leadDocketNumber: '103-22',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '110-22',
      }),
      expect.objectContaining({
        docketNumber: '120-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case is high priority', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '103-22',
              highPriority: true,
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case is manually added', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '103-22',
              isManuallyAdded: true,
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case has high priority suffix', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '103-22',
              docketNumberSuffix: 'P',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '106-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case has high priority suffix', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '104-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '103-22',
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '105-22',
              highPriority: true,
            },
            {
              docketNumber: '102-22',
            },
            {
              docketNumber: '101-22',
            },
            {
              docketNumber: '106-22',
              highPriority: true,
              leadDocketNumber: '103-22',
            },
            {
              docketNumber: '115-22',
              isManuallyAdded: true,
            },
            {
              docketNumber: '112-22',
              isManuallyAdded: true,
            },
            {
              docketNumber: '114-23',
              isManuallyAdded: true,
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '112-22',
      }),
      expect.objectContaining({
        docketNumber: '115-22',
      }),
      expect.objectContaining({
        docketNumber: '114-23',
      }),
      expect.objectContaining({
        docketNumber: '105-22',
      }),
      expect.objectContaining({
        docketNumber: '106-22',
      }),
      expect.objectContaining({
        docketNumber: '101-22',
      }),
      expect.objectContaining({
        docketNumber: '102-22',
      }),
      expect.objectContaining({
        docketNumber: '103-22',
      }),
      expect.objectContaining({
        docketNumber: '104-22',
      }),
    ]);
  });

  it('should not group the consolidated cases when the lead case has high priority suffix', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '30535-15',
              highPriority: true,
              leadDocketNumber: '30533-15',
            },
            {
              docketNumber: '33089-21',
              docketNumberSuffix: 'L',
              leadDocketNumber: '6450-19',
            },
            {
              docketNumber: '6450-19',
              leadDocketNumber: '6450-19',
            },
            {
              docketNumber: '30533-15',
              leadDocketNumber: '30533-15',
            },
          ],
        },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        docketNumber: '30535-15',
      }),
      expect.objectContaining({
        docketNumber: '33089-21',
      }),
      expect.objectContaining({
        docketNumber: '30533-15',
      }),
      expect.objectContaining({
        docketNumber: '6450-19',
      }),
    ]);
    expect(result.every(({ shouldIndent }) => !shouldIndent)).toBeTruthy();
  });

  it('should display all cases when filter is falsy', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        screenMetadata: {
          eligibleCasesFilter: {
            hybridSessionFilter: undefined,
          },
        },
        trialSession: {
          eligibleCases: MOCK_ELIGIBLE_CASES,
        },
      },
    });

    expect(result).toHaveLength(MOCK_ELIGIBLE_CASES.length);
  });

  it('should display all small cases when filter is equal to Small', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        screenMetadata: {
          eligibleCasesFilter: {
            hybridSessionFilter: 'Small',
          },
        },
        trialSession: {
          eligibleCases: MOCK_ELIGIBLE_CASES,
        },
      },
    });

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
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        screenMetadata: {
          eligibleCasesFilter: {
            hybridSessionFilter: 'Regular',
          },
        },
        trialSession: {
          eligibleCases: MOCK_ELIGIBLE_CASES,
        },
      },
    });

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
