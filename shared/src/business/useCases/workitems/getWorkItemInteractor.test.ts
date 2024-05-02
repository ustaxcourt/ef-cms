import { DOCKET_SECTION, ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getWorkItemInteractor } from './getWorkItemInteractor';

describe('getWorkItemInteractor', () => {
  let mockWorkItem = {
    createdAt: '',
    docketEntry: {
      createdAt: '2019-03-11T21:56:01.625Z',
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      documentType: 'Petition',
      entityName: 'DocketEntry',
      eventCode: 'P',
      filedBy: 'Lewis Dodgson',
      filingDate: '2019-03-11T21:56:01.625Z',
      isDraft: false,
      isOnDocketRecord: true,
      sentBy: 'petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
    },
    docketNumber: '101-18',
    docketNumberWithSuffix: '101-18S',
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const mockPetitionerUser = {
    role: ROLES.petitioner,
    userId: 'petitioner',
  };

  const mockDocketClerkUser = {
    role: ROLES.docketClerk,
    userId: 'docketclerk',
  };

  it('throws an error if the work item was not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(null);
    let error;
    try {
      await getWorkItemInteractor(applicationContext, {
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    let error;
    try {
      await getWorkItemInteractor(applicationContext, {
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockDocketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    const result = await getWorkItemInteractor(applicationContext, {
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toMatchObject({
      docketEntry: { sentBy: 'petitioner' },
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      section: DOCKET_SECTION,
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
