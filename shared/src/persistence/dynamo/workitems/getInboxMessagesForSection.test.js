import { getInboxMessagesForSection } from './getInboxMessagesForSection';

describe('getInboxMessagesForSection', () => {
  let applicationContext;
  let queryStub;
  let workItems;

  beforeEach(() => {
    workItems = [
      {
        pk: 'work-item-123',
        section: 'inProgress',
        sk: 'work-item-sortKey',
      },
      {
        pk: 'work-item-321',
        section: 'inProgress',
        sk: 'work-item-sortKey',
      },
      {
        pk: 'work-item-456',
        section: 'inProgress',
        sk: 'work-item-sortKey',
      },
    ];

    queryStub = jest.fn().mockResolvedValue({
      Items: workItems,
    });

    applicationContext = {
      environment: { stage: 'local' },
      getDocumentClient: () => ({
        query: () => ({ promise: queryStub }),
      }),
    };
  });

  it('returns the work items for a given section', async () => {
    const result = await getInboxMessagesForSection({
      applicationContext,
      section: 'inProgress',
    });

    expect(result).toEqual(workItems);
  });
});
