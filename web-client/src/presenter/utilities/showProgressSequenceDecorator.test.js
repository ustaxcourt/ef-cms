import { showProgressSequenceDecorator } from './showProgressSequenceDecorator';

describe('showProgressSequenceDecorator', () => {
  it('should take an array of actions (functions) and return a new array with the same elements wrapped with actions (functions) to set and unset the waiting for response state', () => {
    const mockActionsArray = [jest.fn(), jest.fn(), jest.fn()];
    const result = showProgressSequenceDecorator(mockActionsArray);

    expect(result).toMatchObject([
      expect.any(Function),
      ...mockActionsArray,
      expect.any(Function),
    ]);
  });
});
