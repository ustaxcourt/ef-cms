import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { docketClerkUser } from '../../../../../shared/src/test/mockUsers';
import { getDocumentQCInboxForUserInteractor } from './getDocumentQCInboxForUserInteractor';
import { getDocumentQCInboxForUser as getDocumentQCInboxForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getDocumentQCInboxForUserInteractor', () => {
  const getDocumentQCInboxForUser = getDocumentQCInboxForUserMock as jest.Mock;

  beforeEach(() => {
    const workItem = {
      assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'bob',
      caseStatus: 'New',
      caseTitle: 'Johnny Joe Jacobson',
      docketEntry: {},
      docketNumber: '101-18',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      section: DOCKET_SECTION,
      sentBy: 'bob',
    };

    getDocumentQCInboxForUser.mockReturnValue([workItem]);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
  });

  it('should throw an error when the user does not have access retrieve work items', async () => {
    await expect(
      getDocumentQCInboxForUserInteractor(
        applicationContext,
        {
          userId: '',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should fetch the user from persistence', async () => {
    await getDocumentQCInboxForUserInteractor(
      applicationContext,
      {
        userId: docketClerkUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0]
        .userId,
    ).toEqual(mockDocketClerkUser.userId);
  });

  it('should query workItems that are associated with the provided userId', async () => {
    await getDocumentQCInboxForUserInteractor(
      applicationContext,
      {
        userId: docketClerkUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForUser.mock.calls[0][0].userId).toEqual(
      docketClerkUser.userId,
    );
  });

  it('should filter the workItems for the provided user', async () => {
    await getDocumentQCInboxForUserInteractor(
      applicationContext,
      {
        userId: docketClerkUser.userId,
      },
      mockDocketClerkUser,
    );
  });
});
