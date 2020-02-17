import { showProgressSequenceDecorator } from './sequenceHelpers';

describe('sequenceHelpers', () => {
  describe('showProgressSequenceDecorator', () => {
    it('should take an array of actions (functions) and return a new array with same elements plus a function at beginning and end', () => {
      const mockActionsArray = [jest.fn(), jest.fn(), jest.fn()];
      const result = showProgressSequenceDecorator(mockActionsArray);

      expect(result).toMatchObject([
        expect.any(Function),
        ...mockActionsArray,
        expect.any(Function),
      ]);
    });
    it('should take an array of actions (functions) and return a new array with same elements plus a function at beginning and end', () => {
      const mockActionsArray = [jest.fn(), jest.fn(), jest.fn()];
      const result = showProgressSequenceDecorator(mockActionsArray);

      expect(result).toMatchObject([
        expect.any(Function),
        ...mockActionsArray,
        expect.any(Function),
      ]);
    });
  });
});
