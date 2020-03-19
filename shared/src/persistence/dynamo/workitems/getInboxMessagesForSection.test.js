import { getInboxMessagesForSection } from './getInboxMessagesForSection';
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');

describe('getInboxMessagesForSection', () => {
  const mockWorkItems = [
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
  const queryStub = jest.fn().mockResolvedValue({ Items: mockWorkItems });

  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: queryStub,
    });
  });

  it('returns the work items for a given section', async () => {
    const result = await getInboxMessagesForSection({
      applicationContext,
      section: 'inProgress',
    });

    expect(result).toEqual(mockWorkItems);
  });
});
