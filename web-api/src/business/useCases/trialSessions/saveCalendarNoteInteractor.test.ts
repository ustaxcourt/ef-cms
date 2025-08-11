import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_CASE, MOCK_CASE_WITH_TRIAL_SESSION } from '@shared/test/mockCase';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { saveCalendarNoteInteractor } from './saveCalendarNoteInteractor';
import { createOrUpdateTrialSessionCases as createOrUpdateTrialSessionCasesMock } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('saveCalendarNotes', () => {
  const createOrUpdateTrialSessionCases = jest.mocked(
    createOrUpdateTrialSessionCasesMock,
  );
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  let mockTrialSession;
  let mockCase;

  const MOCK_TRIAL = {
    caseOrder: [],
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: SESSION_TYPES.regular,
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '8675309b-18d0-43ec-bafb-654e83405412',
  };

  beforeEach(() => {
    mockTrialSession = { ...MOCK_TRIAL };

    mockCase = { ...MOCK_CASE };

    getTrialSessionById.mockImplementation(() => mockTrialSession);
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    const mockTrialSessionId = '8675309b-18d0-43ec-bafb-654e83405411';
    mockCase.trialSessionId = mockTrialSessionId;

    await expect(
      saveCalendarNoteInteractor(
        applicationContext,
        {
          calendarNote: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('calls getTrialSessionById with the trialSessionId passed in', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    applicationContext.getUniqueId.mockReturnValue(
      '8675309b-18d0-43ec-bafb-654e83405411',
    );

    await saveCalendarNoteInteractor(
      applicationContext,
      {
        calendarNote: 'whatever',
        docketNumber: mockCase.docketNumber,
        trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
      },
      mockDocketClerkUser,
    );

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getTrialSessionById.mock.calls[0][0]).toMatchObject({
      trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
    });
  });

  it('successfully update the trial session with calendarNotes', async () => {
    mockTrialSession.caseOrder = [
      {
        calendarNotes: 'this is not a calendar note',
        docketNumber: mockCase.docketNumber,
      },
      {
        calendarNotes: 'this is also not a calendar note',
        docketNumber: '123-21',
      },
    ];

    mockCase.trialSessionId = mockTrialSession.trialSessionId;

    const result = await saveCalendarNoteInteractor(
      applicationContext,
      {
        calendarNote: 'this is a calendarNote',
        docketNumber: mockCase.docketNumber,
        trialSessionId: mockTrialSession.trialSessionId,
      },
      mockDocketClerkUser,
    );

    expect(result.trialSessionId).toEqual(mockTrialSession.trialSessionId);
    expect(createOrUpdateTrialSessionCases).toHaveBeenCalled();
    expect(
      createOrUpdateTrialSessionCases.mock.calls[0][0].trialSessionCases,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          caseOrder: expect.objectContaining({
            calendarNotes: 'this is a calendarNote',
            docketNumber: mockCase.docketNumber,
          }),
        }),
        expect.objectContaining({
          caseOrder: expect.objectContaining({
            calendarNotes: 'this is also not a calendar note',
            docketNumber: '123-21',
          }),
        }),
      ]),
    );
  });

  it('updates the case hearing record if the given trial session is a hearing on the case', async () => {
    await saveCalendarNoteInteractor(
      applicationContext,
      {
        calendarNote: 'just updating the hearing note',
        docketNumber: mockCase.docketNumber,
        trialSessionId: '9995309b-18d0-43ec-bafb-654e83405412',
      },
      mockDocketClerkUser,
    );

    expect(createOrUpdateTrialSessionCases).toHaveBeenCalled();
  });
});
