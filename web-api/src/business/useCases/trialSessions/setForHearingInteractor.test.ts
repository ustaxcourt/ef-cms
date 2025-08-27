import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_CASE, MOCK_CASE_WITH_TRIAL_SESSION } from '@shared/test/mockCase';
import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { setForHearingInteractor } from './setForHearingInteractor';
import { createOrUpdateTrialSessionCases as createOrUpdateTrialSessionCasesMock } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('setForHearingInteractor', () => {
  let mockTrialSession;
  let mockCase;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const createOrUpdateTrialSessionCases = jest.mocked(createOrUpdateTrialSessionCasesMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL_REMOTE;

    mockCase = MOCK_CASE;

    getTrialSessionById.mockImplementation(() => mockTrialSession);
    getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('should throw an Unauthorized error when the user role is not allowed to access the method', async () => {
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

  it('should throw an error when the case is not calendared', async () => {
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

  it('should throw an error when the case has a hearing already associated with the trial session', async () => {
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

  it('should not throw an error when the case has no trial sessions or hearings associated with it', async () => {
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
      createOrUpdateTrialSessionCases,
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

    expect(createOrUpdateTrialSessionCases).toHaveBeenCalled();
    expect(createOrUpdateTrialSessionCases.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        trialSessionCases: expect.arrayContaining([
          expect.objectContaining({
            docketNumber: mockCase.docketNumber,
            trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
          }),
        ]),
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
      createOrUpdateTrialSessionCases,
    ).toHaveBeenCalled();
    expect(createOrUpdateTrialSessionCases.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        trialSessionCases: expect.arrayContaining([
          expect.objectContaining({
            docketNumber: mockCase.docketNumber,
            trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
            caseOrder: expect.objectContaining({
              calendarNotes: 'this is a calendarNote',
              docketNumber: mockCase.docketNumber,
            }),
          }),
        ]),
      }),
    );
  });
});
