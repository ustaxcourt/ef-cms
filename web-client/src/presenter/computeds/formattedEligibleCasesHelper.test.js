import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedEligibleCasesHelper as formattedEligibleCasesHelperComputed } from './formattedEligibleCasesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedTrialSessionDetails', () => {
  const formattedEligibleCasesHelper = withAppContextDecorator(
    formattedEligibleCasesHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('compares eligible trial session cases sorting lien/levy and passport first', () => {
    const result = runCompute(formattedEligibleCasesHelper, {
      state: {
        trialSession: {
          eligibleCases: [
            {
              docketNumber: '101-19',
              docketNumberSuffix: '',
              docketNumberWithSuffix: '101-19',
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
        docketNumber: '101-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '101-19',
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
});
