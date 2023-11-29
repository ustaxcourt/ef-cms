import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCServedForSection } from './getDocumentQCServedForSection';

describe('getDocumentQCServedForSection', () => {
  let queryStub;

  beforeEach(() => {
    const itemsToReturn = [
      {
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: null,
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: null,
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];

    queryStub = jest
      .fn()
      .mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Items: itemsToReturn,
            LastEvaluatedKey: 'last-evaluated-key',
          }),
      })
      .mockReturnValue({
        promise: () =>
          Promise.resolve({
            Items: itemsToReturn,
          }),
      });
  });

  it('invokes the persistence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getDocumentQCServedForSection({
      afterDate: 'testing',
      applicationContext,
      section: DOCKET_SECTION,
    });
    expect(
      applicationContext.getDocumentClient().query.mock.calls[1][0],
    ).toMatchObject({
      ExclusiveStartKey: 'last-evaluated-key',
    });
    expect(
      applicationContext.getDocumentClient().query.mock.calls[0][0],
    ).toMatchObject({
      ExclusiveStartKey: undefined,
    });
    expect(items).toEqual(
      expect.arrayContaining([
        {
          completedAt: 'today',
          section: DOCKET_SECTION,
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          completedAt: 'today',
          section: DOCKET_SECTION,
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ]),
    );
  });
});
