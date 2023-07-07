import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { canSetTrialSessionAsCalendaredInteractor } from './canSetTrialSessionAsCalendaredInteractor';

describe('canSetTrialSessionAsCalendaredInteractor', () => {
  let user;
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('throws an error if a user is unauthorized', () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    expect(() =>
      canSetTrialSessionAsCalendaredInteractor(applicationContext, {
        trialSession: MOCK_TRIAL_INPERSON,
      }),
    ).toThrow('Unauthorized');
  });

  it('gets the result back from the interactor with empty fields and an in-person trial proceeding', () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getUniqueId.mockReturnValue('easy-as-abc-123');

    const result = canSetTrialSessionAsCalendaredInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL_INPERSON,
          address1: undefined,
          chambersPhoneNumber: undefined,
          city: undefined,
          judge: undefined,
          postalCode: undefined,
          state: undefined,
        },
      },
    );

    expect(result).toEqual({
      canSetAsCalendared: false,
      emptyFields: [
        'address1',
        'city',
        'state',
        'postalCode',
        'judge',
        'chambersPhoneNumber',
      ],
      isRemote: false,
    });
  });

  it('gets the result back from the interactor with no empty fields and a remote trial proceeding', () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getUniqueId.mockReturnValue('easy-as-abc-123');

    const result = canSetTrialSessionAsCalendaredInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL_INPERSON,
          chambersPhoneNumber: '1234567890',
          joinPhoneNumber: '099987654321',
          judge: {
            name: 'Bootsy Collins',
            userId: '60ed4968-cd19-41f2-9ac5-5f577f7def1a',
          },
          meetingId: '4',
          password: '42',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
      },
    );

    expect(result).toEqual({
      canSetAsCalendared: true,
      emptyFields: [],
      isRemote: true,
    });
  });
});
