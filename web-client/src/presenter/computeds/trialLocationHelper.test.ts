import { trialLocationHelper as trialLocationHelperComputed } from './trialLocationHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

describe('trialLocationHelper', () => {
  const trialLocationHelper = withAppContextDecorator(
    trialLocationHelperComputed,
    applicationContext,
  );

  it('should return the trial location from state.trialLocationPage', () => {
    const result = runCompute(trialLocationHelper, {
      state: {
        blockedCases: [],
        trialLocationPage: {
          blockedCasesPage: 0,
          eligibleCases: [],
          eligibleCasesPage: 0,
          location: 'Baltimore, MD',
        },
      },
    });

    expect(result.location).toEqual('Baltimore, MD');
  });

  it('should return totalPagesBlocked = 1 when blockedCases is fewer than 100', () => {
    const mockBlockedCases = Array.from({ length: 5 }).map((_, i) => ({
      docketNumber: `101-2${i}`,
    }));

    const { totalPagesBlocked } = runCompute(trialLocationHelper, {
      state: {
        blockedCases: mockBlockedCases,
        trialLocationPage: {
          blockedCasesPage: 0,
          eligibleCases: [],
          eligibleCasesPage: 0,
          location: '',
        },
      },
    });

    expect(totalPagesBlocked).toEqual(1);
  });

  it('should return totalPagesBlocked = 2 when there are 101 blocked cases', () => {
    const mockBlockedCases = Array.from({ length: 101 }).map((_, i) => ({
      docketNumber: `Case-${i}`,
    }));

    const { totalPagesBlocked } = runCompute(trialLocationHelper, {
      state: {
        blockedCases: mockBlockedCases,
        trialLocationPage: {
          blockedCasesPage: 0,
          eligibleCases: [],
          eligibleCasesPage: 0,
          location: '',
        },
      },
    });

    expect(totalPagesBlocked).toEqual(2);
  });

  it('should return formattedEligibleCases with caseTitle and isDocketSuffixHighPriority', () => {
    const mockEligibleCases = [
      {
        caseCaption:
          'Test Petitioner v. Commissioner of Internal Revenue, Respondent',
        docketNumber: '123-45',
        docketNumberSuffix: 'L',
      },
      {
        caseCaption: 'Another Petitioner v. Comm.',
        docketNumber: '678-90',
        docketNumberSuffix: 'P',
      },
    ];

    const { formattedEligibleCases } = runCompute(trialLocationHelper, {
      state: {
        blockedCases: [],
        trialLocationPage: {
          blockedCases: [],
          blockedCasesPage: 0,
          eligibleCases: mockEligibleCases,
          eligibleCasesPage: 0,
          location: '',
        },
      },
    });

    expect(formattedEligibleCases).toHaveLength(2);

    expect(formattedEligibleCases[0]).toMatchObject({
      caseTitle:
        'Test Petitioner v. Commissioner of Internal Revenue, Respondent',
      docketNumberSuffix: 'L',
      isDocketSuffixHighPriority: true,
    });
  });

  it('should correctly determine blockedDateEarliest based on blockedDate vs automaticBlockedDate', () => {
    const mockBlockedCases = [
      {
        automaticBlocked: true,
        automaticBlockedDate: '2023-08-20T04:00:00.000Z',
        blocked: true,
        blockedDate: '2023-08-18T04:00:00.000Z',
        docketNumber: '111-23',
      },
      {
        automaticBlocked: true,
        automaticBlockedDate: '2023-08-15T04:00:00.000Z',
        blocked: true,
        blockedDate: '2023-08-16T04:00:00.000Z',
        docketNumber: '222-23',
      },
    ];

    const { formattedBlockedCases } = runCompute(trialLocationHelper, {
      state: {
        blockedCases: mockBlockedCases,
        trialLocationPage: {
          blockedCasesPage: 0,
          eligibleCases: [],
          eligibleCasesPage: 0,
          location: '',
        },
      },
    });

    expect(formattedBlockedCases[0].blockedDateEarliest).toEqual('08/18/23');
    expect(formattedBlockedCases[1].blockedDateEarliest).toEqual('08/15/23');
  });
});
