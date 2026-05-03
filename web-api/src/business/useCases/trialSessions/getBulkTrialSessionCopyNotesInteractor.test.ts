import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getBulkTrialSessionCopyNotesInteractor } from './getBulkTrialSessionCopyNotesInteractor';
import { mockAdminUser, mockJudgeUser } from '@shared/test/mockAuthUsers';
import { getTrialSessionWorkingCopies as getTrialSessionWorkingCopiesMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies';
import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { TrialSessionWorkingCopyNotes } from '@shared/business/entities/trialSessions/SpecialTrialSessions';

const MOCK_WORKING_COPY_NOTES: TrialSessionWorkingCopyNotes[] = [
  {
    sessionNotes: 'Test notes',
    trialSessionId: '123',
  },
  {
    sessionNotes: 'Test notes 2',
    trialSessionId: '456',
  },
];

const MOCK_SESSION_WORKING_COPIES: RawTrialSessionWorkingCopy[] = [
  {
    sessionNotes: 'Test notes',
    trialSessionId: '123',
    caseMetadata: {},
    filters: {
      basisReached: false,
      continued: false,
      definiteTrial: false,
      dismissed: false,
      motionToDismiss: false,
      probableSettlement: false,
      probableTrial: false,
      recall: false,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      submittedCAV: false,
    },
    sort: '',
    sortOrder: 'asc',
    userId: '',
  },
  {
    sessionNotes: 'Test notes 2',
    trialSessionId: '456',
    caseMetadata: {},
    filters: {
      basisReached: false,
      continued: false,
      definiteTrial: false,
      dismissed: false,
      motionToDismiss: false,
      probableSettlement: false,
      probableTrial: false,
      recall: false,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      submittedCAV: false,
    },
    sort: '',
    sortOrder: 'asc',
    userId: '',
  },
];

describe('getBulkTrialSessionCopyNotesInteractor', () => {
  const getTrialSessionWorkingCopies = jest.mocked(
    getTrialSessionWorkingCopiesMock,
  );

  beforeEach(() => {
    getTrialSessionWorkingCopies.mockResolvedValue(MOCK_SESSION_WORKING_COPIES);
  });
  it('should throw an error if the user is unauthorized', async () => {
    await expect(
      getBulkTrialSessionCopyNotesInteractor(
        { specialTrialSessions: [] },
        mockAdminUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return session notes for multiple trial sessions', async () => {
    const result = await getBulkTrialSessionCopyNotesInteractor(
      {
        specialTrialSessions: [
          { trialSessionId: '123', userId: '123' },
          { trialSessionId: '456', userId: '456' },
        ],
      },
      mockJudgeUser,
    );
    expect(result).toEqual(MOCK_WORKING_COPY_NOTES);
  });
});
