const { replaceBracketed } = require('./replaceBracketed');

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
    const results = replaceBracketed('[]', false);
    expect(results).toEqual('');
  });

  it('returns undefined if first argument is undefined', () => {
    const results = replaceBracketed(undefined);
    expect(results).not.toBeDefined();
  });
});
