import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { DOCKET_SECTION } from '@shared/business/entities/EntityConstants';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getDocumentQCInboxForUserInteractor } from './getDocumentQCInboxForUserInteractor';
import { getDocumentQCInboxForUser as getDocumentQCInboxForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  mockCaseServicesSupervisorUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('getDocumentQCInboxForUserInteractor', () => {
  const getUserById = jest.mocked(getUserByIdMock);

  const getDocumentQCInboxForUser = getDocumentQCInboxForUserMock as jest.Mock;

  const workItems = [
    {
      assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'bob',
      caseStatus: 'New',
      caseTitle: 'Johnny Joe Jacobson',
      docketEntry: {},
      docketNumber: '101-18',
      section: DOCKET_SECTION,
      sentBy: 'bob',
    },
  ];

  beforeEach(() => {
    getDocumentQCInboxForUser.mockResolvedValue(workItems);
    getUserById.mockResolvedValue(docketClerkUser as DbUser);
  });

  it('should throw an error when the user does not have access retrieve work items', async () => {
    await expect(
      getDocumentQCInboxForUserInteractor(
        {
          userId: '',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it("should throw unauthorized when a user tries to access another user's document QC without DOCKET_CLERK_REPORT permission", async () => {
    await expect(
      getDocumentQCInboxForUserInteractor(
        { userId: 'some-other-user-id' },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should query workItems when the caller is accessing their own inbox', async () => {
    const result = await getDocumentQCInboxForUserInteractor(
      {
        userId: mockDocketClerkUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForUser.mock.calls[0][0].userId).toEqual(
      mockDocketClerkUser.userId,
    );
    expect(result).toMatchObject(workItems);
  });

  it("should query another user's workItems when the caller has DOCKET_CLERK_REPORT permission", async () => {
    await expect(
      getDocumentQCInboxForUserInteractor(
        { userId: mockDocketClerkUser.userId },
        mockCaseServicesSupervisorUser,
      ),
    ).resolves.not.toThrow();

    expect(getDocumentQCInboxForUser).toHaveBeenCalled();
  });
});
