import { formatPositiveNumber } from './formatPositiveNumber';

describe('formatPositiveNumber', () => {
  it('should return a formatted string with commas', () => {
    const number = 1000000;
    const result = formatPositiveNumber(number);

    expect(result).toEqual('1,000,000');
  });
  it('should not add a minus if the number is zero', () => {
    const number = -0;
    const result = formatPositiveNumber(number);

    expect(result).toEqual('0');
  });
});
