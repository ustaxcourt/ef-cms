import { ReadOnlyModeError } from './ReadOnlyModeError';

describe('ReadOnlyModeError', () => {
  it('should have the correct title and message', () => {
    const error = new ReadOnlyModeError();
    expect(error.title).toEqual('System Upgrade in Progress');
    expect(error.message).toEqual(
      'System is upgrading. Please wait a few minutes and try again.',
    );
  });
});
