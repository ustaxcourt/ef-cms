import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DOCKET_SECTION } from '@shared/business/entities/EntityConstants';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getDocumentQCInboxForUserInteractor } from './getDocumentQCInboxForUserInteractor';
import { getDocumentQCInboxForUser as getDocumentQCInboxForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

describe('getDocumentQCInboxForUserInteractor', () => {
  const getDocumentQCInboxForUser = getDocumentQCInboxForUserMock as jest.Mock;
  const getUserById = getUserByIdMock as jest.Mock;

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

    getUserById.mockReturnValue(docketClerkUser);
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

  it('should query workItems that are associated with the provided userId', async () => {
    const result = await getDocumentQCInboxForUserInteractor(
      {
        userId: docketClerkUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForUser.mock.calls[0][0].userId).toEqual(
      docketClerkUser.userId,
    );
    expect(result).toMatchObject(workItems);
  });
});
