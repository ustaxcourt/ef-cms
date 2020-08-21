import { getInboxMessagesForUser } from './getInboxMessagesForUser';
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');

describe('getInboxMessagesForUser', () => {
  const mockWorkItems = [
    {
      assigneeId: '3fbc6411-c760-4622-81e9-87055fcabc29',
      pk: 'user|3fbc6411-c760-4622-81e9-87055fcabc29',
      section: 'inProgress',
      sk: 'work-item|7695c3ef-446c-4cae-ad40-df0f2d991287',
    },
    {
      assigneeId: '3fbc6411-c760-4622-81e9-87055fcabc29',
      pk: 'user|3fbc6411-c760-4622-81e9-87055fcabc29',
      section: 'inProgress',
      sk: 'work-item|3ec764c0-64af-4104-8353-6392e5cb8afe',
    },
    {
      assigneeId: '1305a27c-1ba2-4ab4-b43e-01a96810484a',
      pk: 'user|1305a27c-1ba2-4ab4-b43e-01a96810484a',
      section: 'inProgress',
      sk: 'work-item|ac9aaad4-22e9-4168-8d3d-c42ea5a9f586',
    },
  ];

  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => Promise.resolve({ Items: mockWorkItems }),
    });
  });

  it('returns the work items for a given section', async () => {
    const result = await getInboxMessagesForUser({
      applicationContext,
      userId: '3fbc6411-c760-4622-81e9-87055fcabc29',
    });

    expect(result).toEqual([mockWorkItems[0], mockWorkItems[1]]);
  });
});
