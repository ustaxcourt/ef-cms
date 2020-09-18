const { filterWorkItemsForUser } = require('./filterWorkItemsForUser');

describe('filterWorkItemsForUser', () => {
  it('filters the given workItems based on the given user assignment and section', () => {
    const result = filterWorkItemsForUser({
      user: {
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      workItems: [
        {
          isRead: true,
          pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
          sk: 'work-item|3eebd91b-29a3-4739-bc1b-632c98571942',
        },
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          isRead: true,
          pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
          section: 'docket',
          sk: 'work-item|999bd91b-29a3-4739-bc1b-632c98571942',
        },
        {
          assigneeId: '9995d1ab-18d0-43ec-bafb-654e83405416',
          isRead: true,
          pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
          section: 'docket',
          sk: 'work-item|999bd91b-29a3-4739-bc1b-632c98571942',
        },
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          isRead: true,
          pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
          section: 'petitions',
          sk: 'work-item|999bd91b-29a3-4739-bc1b-632c98571942',
        },
      ],
    });

    expect(result).toEqual([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        isRead: true,
        pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        sk: 'work-item|999bd91b-29a3-4739-bc1b-632c98571942',
      },
    ]);
  });
});
