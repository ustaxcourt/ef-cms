import { limitLength } from './limitLength';

describe('limitLength', () => {
  it('should shorten 123 to 12', () => {
    const result = limitLength('123', 2);
    expect(result).toEqual('12');
  });
  it('should shorten 1 to 1', () => {
    const result = limitLength('1', 2);
    expect(result).toEqual('1');
  });
});
