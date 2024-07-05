import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { canSetTrialSessionAsCalendaredInteractor } from './canSetTrialSessionAsCalendaredInteractor';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

const MOCK_TRIAL = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('canSetTrialSessionAsCalendaredInteractor', () => {
  it('throws an error if a user is unauthorized', () => {
    expect(() =>
      canSetTrialSessionAsCalendaredInteractor(undefined, {
        trialSession: MOCK_TRIAL as RawTrialSession,
      }),
    ).toThrow('Unauthorized');
  });

  it('gets the result back from the interactor with empty fields and an in-person trial proceeding', () => {
    const result = canSetTrialSessionAsCalendaredInteractor(
      mockPetitionsClerkUser,
      {
        trialSession: MOCK_TRIAL as RawTrialSession,
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
    const result = canSetTrialSessionAsCalendaredInteractor(
      mockPetitionsClerkUser,
      {
        trialSession: {
          ...MOCK_TRIAL,
          chambersPhoneNumber: '1234567890',
          joinPhoneNumber: '099987654321',
          judge: { name: 'Bootsy Collins' },
          meetingId: '4',
          password: '42',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        } as RawTrialSession,
      },
    );

    expect(result).toEqual({
      canSetAsCalendared: true,
      emptyFields: [],
      isRemote: true,
    });
  });
});
