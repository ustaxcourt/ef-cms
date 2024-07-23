import {
  MOCK_CASE,
  MOCK_CASE_WITH_TRIAL_SESSION,
} from '../../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_REMOTE } from '../../../../../shared/src/test/mockTrial';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { setForHearingInteractor } from './setForHearingInteractor';

describe('setForHearingInteractor', () => {
  let mockTrialSession;
  let mockCase;

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL_REMOTE;

    mockCase = MOCK_CASE;

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    await expect(
      setForHearingInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if the case is not calendared', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    await expect(
      setForHearingInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('That Hearing is already assigned to the Case');
  });

  it('throws an error if the case has a hearing already associated with the trial session', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
      hearings: [
        { trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId },
      ],
    };

    await expect(
      setForHearingInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('That Hearing is already assigned to the Case');
  });

  it('does not throw an error if the case has no trial sessions or hearings associated with it', async () => {
    mockCase = {
      ...MOCK_CASE,
      hearings: [],
    };

    await setForHearingInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: mockCase.docketNumber,
        trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing,
    ).toHaveBeenCalled();
  });

  it('should add the trial session hearing', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    await setForHearingInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: mockCase.docketNumber,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing.mock
        .calls[0][0],
    ).toEqual(
      expect.objectContaining({
        applicationContext: expect.anything(),
        docketNumber: mockCase.docketNumber,
        trialSession: expect.objectContaining({
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
        }),
      }),
    );
  });

  it('should add the trial session hearing with calendarNotes', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    await setForHearingInteractor(
      applicationContext,
      {
        calendarNotes: 'this is a calendarNote',
        docketNumber: mockCase.docketNumber,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing.mock
        .calls[0][0],
    ).toEqual(
      expect.objectContaining({
        applicationContext: expect.anything(),
        docketNumber: mockCase.docketNumber,
        trialSession: expect.objectContaining({
          caseOrder: expect.arrayContaining([
            expect.objectContaining({
              calendarNotes: 'this is a calendarNote',
              docketNumber: mockCase.docketNumber,
            }),
          ]),
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
        }),
      }),
    );
  });
});
