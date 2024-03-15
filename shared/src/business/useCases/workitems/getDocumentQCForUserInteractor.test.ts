import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { InvalidRequest } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';
import { getDocumentQCForUserInteractor } from './getDocumentQCForUserInteractor';

describe('getDocumentQCForUserInteractor', () => {
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
      .getDocumentQCForUser.mockReturnValue([workItem]);
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  it('should throw an error when the user does not have access retrieve work items', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getDocumentQCForUserInteractor(applicationContext, {
        box: 'inbox',
        userId: null,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should query workItems that are associated with the provided userId', async () => {
    await getDocumentQCForUserInteractor(applicationContext, {
      box: 'inbox',
      userId: docketClerkUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForUser.mock
        .calls[0][0].userId,
    ).toEqual(docketClerkUser.userId);
  });

  it('queries workItems that are in the provided box', async () => {
    await getDocumentQCForUserInteractor(applicationContext, {
      box: 'inbox',
      userId: docketClerkUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForUser.mock
        .calls[0][0].box,
    ).toEqual('inbox');
  });

  it('queries the for completed work items if the provided box is outbox', async () => {
    await getDocumentQCForUserInteractor(applicationContext, {
      box: 'outbox',
      userId: docketClerkUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDocumentQCServedForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: docketClerkUser.userId,
    });
  });

  it('throws an error if an invalid box is provided', async () => {
    await expect(
      getDocumentQCForUserInteractor(applicationContext, {
        box: 'cardboard' as any,
        userId: docketClerkUser.userId,
      }),
    ).rejects.toThrow(InvalidRequest);
  });
});
