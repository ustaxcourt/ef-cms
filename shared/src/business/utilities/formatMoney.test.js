import { formatMoney } from './formatMoney';

describe('formatMoney', () => {
  it('should return a formatted money string', () => {
    const number = 1000000;
    const result = formatMoney(number);

    expect(result).toEqual('$1,000,000.00');
  });
});
