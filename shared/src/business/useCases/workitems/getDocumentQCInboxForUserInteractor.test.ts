import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';
import { getDocumentQCInboxForUserInteractor } from './getDocumentQCForUserInteractor';

describe('getDocumentQCInboxForUserInteractor', () => {
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

    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([workItem]);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
  });

  it('should throw an error when the user does not have access retrieve work items', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getDocumentQCInboxForUserInteractor(applicationContext, {
        userId: null,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should fetch the user from persistence', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: docketClerkUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0]
        .userId,
    ).toEqual(docketClerkUser.userId);
  });

  it('should query workItems that are associated with the provided userId', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: docketClerkUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForUser.mock
        .calls[0][0].userId,
    ).toEqual(docketClerkUser.userId);
  });

  it('should filter the workItems for the provided user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: docketClerkUser.userId,
    });
  });
});
