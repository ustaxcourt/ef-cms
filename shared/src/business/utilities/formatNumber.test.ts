import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  it('should return a formatted string with commas', () => {
    const number = 1000000;
    const result = formatNumber(number);

    expect(result).toEqual('1,000,000');
  });
});
