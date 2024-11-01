import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getBulkTrialSessionCopyNotesInteractor } from './getBulkTrialSessionCopyNotesInteractor';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';

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
const mockUnknownUser: AuthUser = {
  email: 'someEmail@flexion.com',
  name: 'Nora Scott',
  role: ROLES.admissionsClerk,
  userId: 'e796d8cd-2e85-4d79-b4e1-281b59cacd5f',
};
describe('getBulkTrialSessionCopyNotesInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getBulkTrialSessionWorkingCopyNotes.mockReturnValue(
        MOCK_WORKING_COPY_NOTES,
      );
  });
  it('should throw an error if the user is unauthorized', async () => {
    const mockUnauthorizedUser = omit(mockUnknownUser, 'role');
    await expect(
      getBulkTrialSessionCopyNotesInteractor(
        applicationContext,
        { specialTrialSessions: [] },
        mockUnauthorizedUser,
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
