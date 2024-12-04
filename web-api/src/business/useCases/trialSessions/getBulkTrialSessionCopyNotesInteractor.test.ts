import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getBulkTrialSessionCopyNotesInteractor } from './getBulkTrialSessionCopyNotesInteractor';
import { mockAdminUser, mockJudgeUser } from '@shared/test/mockAuthUsers';

const MOCK_WORKING_COPY_NOTES = [
  {
    sessionNotes: 'Test notes',
    trialSessionId: '123',
  },
  {
    sessionNotes: 'Test notes 2',
    trialSessionId: '456',
  },
];
describe('getBulkTrialSessionCopyNotesInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getBulkTrialSessionWorkingCopyNotes.mockReturnValue(
        MOCK_WORKING_COPY_NOTES,
      );
  });
  it('should throw an error if the user is unauthorized', async () => {
    await expect(
      getBulkTrialSessionCopyNotesInteractor(
        applicationContext,
        { specialTrialSessions: [] },
        mockAdminUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return session notes for multiple trial sessions', async () => {
    const result = await getBulkTrialSessionCopyNotesInteractor(
      applicationContext,
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
