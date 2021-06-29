const { ROLES } = require('./EntityConstants');

describe('EntityConstants', () => {
  'use strict';
  it('receives constants as read-only (frozen)', () => {
    expect(ROLES.docketClerk).toBeDefined();
    expect(Object.isFrozen(ROLES)).toBe(true);
    expect(() => (ROLES.docketClerk = 'clark kent')).toThrow();
    expect(ROLES.docketClerk).toBe('docketclerk');
  });
});
