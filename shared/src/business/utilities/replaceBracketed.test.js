const { replaceBracketed } = require('./replaceBracketed');

describe('replaceBracketed', () => {
  it('puts in the correct values', () => {
    const results = replaceBracketed('[][][]', 'a', 'b', 'c');
    expect(results).toEqual('abc');
  });

  it('does nothing on empty input', () => {
    const results = replaceBracketed('[]', false);
    expect(results).toEqual('');
  });
});
