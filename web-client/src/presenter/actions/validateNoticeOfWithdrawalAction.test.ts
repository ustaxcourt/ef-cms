import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNoticeOfWithdrawalAction } from './validateNoticeOfWithdrawalAction';
import { calculateISODate } from '@shared/business/utilities/DateHandler';

describe('validateNoticeOfWithdrawalAction', () => {
  const { CASE_STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();
  beforeAll(() => {
    presenter.providers.path = {
      success: jest.fn(),
      error: jest.fn(),
    };
  });
  it('should have no errors if it is not a notice of withdrawal', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'ABC',
        },
      },
    });
    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.error).toHaveBeenCalledTimes(0);
  });

  it('should have no errors if it is a notice of withdrawal and case is scheduled more than 30 days in the future', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.petitioner,
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.calendared,
          trialDate: calculateISODate({ howMuch: 31, units: 'days' }),
        },
      },
    });
    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.error).toHaveBeenCalledTimes(0);
  });

  it('should return an error if the case is scheduled within 30 days', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.petitioner,
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.calendared,
          trialDate: calculateISODate({ howMuch: 29, units: 'days' }),
          petitioners: [],
          irsPractitioners: [],
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message:
          'You must file a Motion to Withdraw as Counsel because of the following:',
        title: 'Cannot file Notice of Withdrawal as Counsel',
        messages: ['This case is scheduled for trial in less than 30 days.'],
      },
    });
  });

  it('should return error for private practitioner with no other counsel', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.privatePractitioner,
          userId: 'practitioner-1',
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.generalDocket,
          petitioners: [{ contactId: 'petitioner-1' }],
          privatePractitioners: [
            {
              userId: 'practitioner-1',
              representing: ['petitioner-1'],
            },
          ],
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message:
          'You must file a Motion to Withdraw as Counsel because of the following:',
        title: 'Cannot file Notice of Withdrawal as Counsel',
        messages: [
          'You are the only counsel representing your party on this case.',
        ],
      },
    });
  });

  it('should not return an error for private practitioner when there are other counsel', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.privatePractitioner,
          userId: 'practitioner-1',
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.generalDocket,
          petitioners: [{ contactId: 'petitioner-1' }],
          privatePractitioners: [
            {
              userId: 'practitioner-1',
              representing: ['petitioner-1'],
            },
            {
              userId: 'practitioner-2',
              representing: ['petitioner-1'],
            },
          ],
        },
      },
    });
    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.error).toHaveBeenCalledTimes(0);
  });

  it('should return error for IRS practitioner when only one IRS practitioner', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.irsPractitioner,
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.generalDocket,
          petitioners: [],
          irsPractitioners: [{ userId: 'irs-practitioner-1' }],
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message:
          'You must file a Motion to Withdraw as Counsel because of the following:',
        title: 'Cannot file Notice of Withdrawal as Counsel',
        messages: [
          'You are the only counsel representing your party on this case.',
        ],
      },
    });
  });

  it('should not return errors for IRS practitioner when there are other counsel', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.irsPractitioner,
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.generalDocket,
          petitioners: [],
          irsPractitioners: [
            { userId: 'irs-practitioner-1' },
            { userId: 'irs-practitioner-2' },
          ],
        },
      },
    });
    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.error).toHaveBeenCalledTimes(0);
  });

  it('should return multiple errors when both conditions are met', () => {
    runAction(validateNoticeOfWithdrawalAction, {
      modules: { presenter },
      state: {
        form: {
          eventCode: 'NOTW',
        },
        user: {
          role: USER_ROLES.privatePractitioner,
        },
        caseDetail: {
          status: CASE_STATUS_TYPES.calendared,
          trialDate: calculateISODate({ howMuch: 15, units: 'days' }),
          petitioners: [{ contactId: 'petitioner-1' }],
          privatePractitioners: [
            {
              userId: 'practitioner-1',
              representing: ['petitioner-1'],
            },
          ],
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message:
          'You must file a Motion to Withdraw as Counsel because of the following:',
        title: 'Cannot file Notice of Withdrawal as Counsel',
        messages: [
          'You are the only counsel representing your party on this case.',
          'This case is scheduled for trial in less than 30 days.',
        ],
      },
    });
  });

  beforeEach(() => {
    presenter.providers.path.success.mockClear();
    presenter.providers.path.error.mockClear();
  });
});
