import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { getWorkItemInteractor } from './getWorkItemInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getWorkItemInteractor', () => {
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
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
    docketNumberSuffix: 'S',
    docketNumberWithSuffix: '101-18S',
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('throws an error if the work item was not found', async () => {
    getWorkItemById.mockResolvedValue(null);
    let error;
    try {
      await getWorkItemInteractor(
        applicationContext,
        {
          workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      );
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));

    let error;
    try {
      await getWorkItemInteractor(
        applicationContext,
        {
          workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      );
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));

    const result = await getWorkItemInteractor(
      applicationContext,
      {
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );
    expect(result).toMatchObject({
      docketEntry: { sentBy: 'petitioner' },
      docketNumber: '101-18',
      section: DOCKET_SECTION,
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
