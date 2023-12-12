import { debounce } from 'cerebral/factories';
import { debounceSequenceDecorator } from './debounceSequenceDecorator';

jest.mock('cerebral/factories', () => {
  return {
    debounce: jest.fn(),
  };
});

describe('debounceSequenceDecorator', () => {
  const debounceMs = 300;
  const mockActionsArray = [jest.fn(), jest.fn(), jest.fn()];

  it('should take an array of actions and return a new array with the same elements wrapped with actions to debounce the sequence', () => {
    const result = debounceSequenceDecorator(debounceMs, mockActionsArray);

    expect(result).toMatchObject([
      debounce(debounceMs),
      { continue: mockActionsArray, discard: [] },
    ]);
  });

  it('should call the cerebral debounce function with the provided delay in ms', () => {
    debounceSequenceDecorator(debounceMs, mockActionsArray);

    expect(debounce).toHaveBeenCalledWith(debounceMs);
  });
});
