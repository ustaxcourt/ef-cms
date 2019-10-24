import { mappedUserHelper } from './mappedUserHelper';
import { runCompute } from 'cerebral/test';

describe('mappedUserHelper', () => {
  it('should return the mapped User', () => {
    const mappedUser = runCompute(mappedUserHelper, {
      state: {
        user: {
          email: 'docketclerk',
          name: 'Test Docketclerk',
          role: 'docketclerk',
          section: 'docket',
          userId: 'abc-123',
        },
      },
    });

    expect(mappedUser).toEqual({
      email: { docketclerk: true },
      name: { testDocketclerk: true },
      role: { docketclerk: true },
      section: { docket: true },
      userId: { abc123: true },
    });
  });
});
