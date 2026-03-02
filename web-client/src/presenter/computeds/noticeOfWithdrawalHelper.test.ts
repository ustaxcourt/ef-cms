import { applicationContextForClient as applicationContext } from '../../test/createClientTestApplicationContext';
import { noticeOfWithdrawalHelper as noticeOfWithdrawalHelperComputed } from './noticeOfWithdrawalHelper';
import { withAppContextDecorator } from '../../withAppContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { mockPetitioners } from './mockFormattedCaseDetailTestFixtures';

describe('noticeOfWithdrawalHelper', () => {
  const { USER_ROLES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();
  const noticeOfWithdrawalHelper = withAppContextDecorator(
    noticeOfWithdrawalHelperComputed,
    applicationContext,
  );

  it('should return the parties that can be withdrawn from as a private practitioner', () => {
    const result = runCompute(noticeOfWithdrawalHelper, {
      state: {
        user: { role: USER_ROLES.privatePractitioner, userId: 'pp1' },
        caseDetail: {
          petitioners: mockPetitioners,
          privatePractitioners: [
            {
              userId: 'pp1',
              representing: [mockPetitioners[0].contactId],
            },
            {
              userId: 'pp2',
              representing: [mockPetitioners[0].contactId],
            },
          ],
        },
      },
    });
    expect(result.filers).toEqual([mockPetitioners[0]]);
  });

  it('should set showRespondant to true for IRS practitioners', () => {
    const result = runCompute(noticeOfWithdrawalHelper, {
      state: {
        user: { role: USER_ROLES.irsPractitioner, userId: 'irs1' },
        caseDetail: {
          petitioners: mockPetitioners,
        },
      },
    });
    expect(result.showRespondent).toBe(true);
  });

  it('should set showEditContactInformation to true if any filing party does not have a sealed address', () => {
    const result = runCompute(noticeOfWithdrawalHelper, {
      state: {
        user: { role: USER_ROLES.privatePractitioner, userId: 'pp1' },
        caseDetail: {
          petitioners: mockPetitioners,
          privatePractitioners: [
            {
              userId: 'pp1',
              representing: [mockPetitioners[0].contactId],
            },
            {
              userId: 'pp2',
              representing: [mockPetitioners[0].contactId],
            },
          ],
        },
      },
    });
    expect(result.showEditContactInformation).toBe(true);
  });

  it('should set showEditContactInformation to false if all filing parties have sealed addresses', () => {
    const result = runCompute(noticeOfWithdrawalHelper, {
      state: {
        user: { role: USER_ROLES.privatePractitioner, userId: 'pp1' },
        caseDetail: {
          petitioners: [{ ...mockPetitioners[0], isAddressSealed: true }],
          privatePractitioners: [
            {
              userId: 'pp1',
              representing: [mockPetitioners[0].contactId],
            },
            {
              userId: 'pp2',
              representing: [mockPetitioners[0].contactId],
            },
          ],
        },
      },
    });
    expect(result.showEditContactInformation).toBe(false);
  });

  it('should return the parties with paper service', () => {
    const expected = {
      ...mockPetitioners[0],
      serviceType: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };
    const result = runCompute(noticeOfWithdrawalHelper, {
      state: {
        user: { role: USER_ROLES.privatePractitioner, userId: 'pp1' },
        caseDetail: {
          petitioners: [
            expected,
            {
              ...mockPetitioners[0],
            },
          ],
          privatePractitioners: [
            {
              userId: 'pp1',
              representing: [mockPetitioners[0].contactId],
            },
            {
              userId: 'pp2',
              representing: [mockPetitioners[0].contactId],
            },
          ],
        },
      },
    });
    expect(result.filers).toEqual([expected]);
  });
});
