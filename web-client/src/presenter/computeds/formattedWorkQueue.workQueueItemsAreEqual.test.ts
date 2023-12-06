import { workQueueItemsAreEqual } from './formattedWorkQueue';

describe('workQueueItemsAreEqual', () => {
  it('returns true if both objects "item" properties stringify to the same result', () => {
    const first = { item: { has: 'a first name', my: 'bologna' } };
    const second = { ...first };

    expect(workQueueItemsAreEqual(first, second)).toBe(true);
  });

  it('returns false if "item" properties differ', () => {
    const first = { item: { has: 'a first', my: 'bologna', name: 'oscar' } };
    const second = {
      item: { has: 'a second', my: 'bologna', name: 'mayer' },
    };

    expect(workQueueItemsAreEqual(first, second)).toBe(false);
  });
});
