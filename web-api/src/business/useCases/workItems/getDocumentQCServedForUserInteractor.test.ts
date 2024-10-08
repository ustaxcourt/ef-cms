import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCServedForUserInteractor } from './getDocumentQCServedForUserInteractor';
import { getDocumentQCServedForUser as getDocumentQCServedForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCServedForUser';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getDocumentQCServedForUserInteractor', () => {
  const getDocumentQCServedForUser =
    getDocumentQCServedForUserMock as jest.Mock;
  beforeEach(() => {
    getDocumentQCServedForUser.mockReturnValue([
      new WorkItem({
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
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      }),
      new WorkItem({
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
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      }),
    ]);

    applicationContext.getUniqueId.mockReturnValue(
      '93bac4bd-d6ea-4ac7-8ff5-bf2501b1a1f2',
    );
  });

  it('throws an error if the user does not have access to the work item', async () => {
    await expect(
      getDocumentQCServedForUserInteractor(
        applicationContext,
        {
          userId: '123',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a petitions clerk', async () => {
    const result = await getDocumentQCServedForUserInteractor(
      applicationContext,
      {
        userId: '123',
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject([
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
    ]);
  });

  it('successfully returns the work items for a docket clerk', async () => {
    const result = await getDocumentQCServedForUserInteractor(
      applicationContext,
      {
        userId: 'abc',
      },
      mockDocketClerkUser,
    );
    expect(result).toMatchObject([
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',

        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
    ]);
  });
});
