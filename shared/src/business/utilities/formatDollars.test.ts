import { formatDollars } from './formatDollars';

describe('formatDollars', () => {
  it('should return a formatted string with dollar sign, commas, and decimal', () => {
    const number = 1000000;
    const result = formatDollars(number);

    expect(result).toEqual('$1,000,000.00');
  });
});
