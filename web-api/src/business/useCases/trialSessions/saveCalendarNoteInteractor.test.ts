import {
  MOCK_CASE,
  MOCK_CASE_WITH_TRIAL_SESSION,
} from '../../../../../shared/src/test/mockCase';
import {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { saveCalendarNoteInteractor } from './saveCalendarNoteInteractor';

describe('saveCalendarNotes', () => {
  let mockCurrentUser;
  let mockTrialSession;
  let mockCase;

  const MOCK_TRIAL = {
    caseOrder: [],
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '8675309b-18d0-43ec-bafb-654e83405412',
  };

  beforeEach(() => {
    mockCurrentUser = {
      role: ROLES.docketClerk,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };

    mockTrialSession = { ...MOCK_TRIAL };

    mockCase = { ...MOCK_CASE };

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    mockCurrentUser = {
      role: ROLES.petitioner,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };
    const mockTrialSessionId = '8675309b-18d0-43ec-bafb-654e83405411';
    mockCase.trialSessionId = mockTrialSessionId;

    await expect(
      saveCalendarNoteInteractor(applicationContext, {
        calendarNote: 'testing',
        docketNumber: mockCase.docketNumber,
        trialSessionId: mockTrialSessionId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('calls getTrialSessionById with the trialSessionId passed in', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    applicationContext.getUniqueId.mockReturnValue(
      '8675309b-18d0-43ec-bafb-654e83405411',
    );

    await saveCalendarNoteInteractor(applicationContext, {
      calendarNote: 'whatever',
      docketNumber: mockCase.docketNumber,
      trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0],
    ).toMatchObject({
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

    const result = await saveCalendarNoteInteractor(applicationContext, {
      calendarNote: 'this is a calendarNote',
      docketNumber: mockCase.docketNumber,
      trialSessionId: mockTrialSession.trialSessionId,
    });

    expect(result.trialSessionId).toEqual(mockTrialSession.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.caseOrder,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          calendarNotes: 'this is a calendarNote',
          docketNumber: mockCase.docketNumber,
        }),
        expect.objectContaining({
          calendarNotes: 'this is also not a calendar note',
          docketNumber: '123-21',
        }),
      ]),
    );
  });

  it('does not update the case hearing record if the given trial session is not a hearing on the case', async () => {
    await saveCalendarNoteInteractor(applicationContext, {
      calendarNote: 'this is a calendarNote',
      docketNumber: mockCase.docketNumber,
      trialSessionId: mockTrialSession.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing,
    ).not.toHaveBeenCalled();
  });

  it('updates the case hearing record if the given trial session is a hearing on the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      hearings: [
        {
          ...MOCK_TRIAL,
          caseOrder: [
            {
              calendarNotes: 'just a hearing note',
              docketNumber: MOCK_CASE.docketNumber,
            },
            {
              calendarNotes: 'another hearing note',
              docketNumber: '123-21',
            },
          ],
          trialSessionId: '9995309b-18d0-43ec-bafb-654e83405412',
        },
      ],
      trialSessionId: '8885309b-18d0-43ec-bafb-654e83405412',
    };

    await saveCalendarNoteInteractor(applicationContext, {
      calendarNote: 'just updating the hearing note',
      docketNumber: mockCase.docketNumber,
      trialSessionId: '9995309b-18d0-43ec-bafb-654e83405412',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing,
    ).toHaveBeenCalled();
  });

  it('does not update the case hearing record if that hearing is not on the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      hearings: [
        {
          ...MOCK_TRIAL,
          caseOrder: [
            {
              calendarNotes: 'just a hearing note',
              docketNumber: MOCK_CASE.docketNumber,
            },
            {
              calendarNotes: 'another hearing note',
              docketNumber: '123-21',
            },
          ],
          trialSessionId: '1115309b-18d0-43ec-bafb-654e83405412',
        },
      ],
      trialSessionId: '8885309b-18d0-43ec-bafb-654e83405412',
    };

    await saveCalendarNoteInteractor(applicationContext, {
      calendarNote: 'just updating the hearing note',
      docketNumber: mockCase.docketNumber,
      trialSessionId: '9995309b-18d0-43ec-bafb-654e83405412',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing,
    ).not.toHaveBeenCalled();
  });
});
