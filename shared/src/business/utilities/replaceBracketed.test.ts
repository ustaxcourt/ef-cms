import { replaceBracketed } from './replaceBracketed';

describe('replaceBracketed', () => {
  it('puts in the correct values', () => {
    const results = replaceBracketed('[][][]', 'a', 'b', 'c');
    expect(results).toEqual('abc');
  });

  it('puts in the correct values without an optional value and trims whitespace', () => {
    const results = replaceBracketed('[][][] ', 'a', 'b');
    expect(results).toEqual('ab');
  });

  it('does nothing on empty input', () => {
    const results = replaceBracketed('[]', false as any);
    expect(results).toEqual('');
  });
});
