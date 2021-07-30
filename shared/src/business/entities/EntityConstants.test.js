const { filter8684CategoryMap, ROLES } = require('./EntityConstants');

describe('EntityConstants', () => {
  'use strict';
  it('receives constants as read-only (frozen)', () => {
    expect(ROLES.docketClerk).toBeDefined();
    expect(Object.isFrozen(ROLES)).toBe(true);
    expect(() => (ROLES.docketClerk = 'clark kent')).toThrow();
    expect(ROLES.docketClerk).toBe('docketclerk');
  });
});

describe('filter8684CategoryMap', () => {
  it('should hide any MOTR documents if the flag is set', () => {
    const categoryMap = {
      motions: [
        {
          eventCode: 'MOTR',
        },
      ],
    };

    filter8684CategoryMap(categoryMap, false);
    expect(categoryMap).toEqual({
      motions: [],
    });
  });

  it('should hide any MOTR documents if the flag is set', () => {
    const categoryMap = {
      motions: [
        {
          eventCode: 'MOTR',
        },
      ],
    };

    filter8684CategoryMap(categoryMap, true);
    expect(categoryMap).toEqual({
      motions: [
        {
          eventCode: 'MOTR',
        },
      ],
    });
  });
});
