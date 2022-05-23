const { getMetadataLines } = require('./createLogger');

describe('getMetadataLines', () => {
  it('should get empty array with no info', () => {
    const metadata = {};
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });

  it('should get empty array with only undefined properties', () => {
    const metadata = { fieldOne: undefined, fieldTwo: undefined };
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });

  it('should get empty array with only level and message properties', () => {
    const metadata = { level: 'info', message: 'some message' };
    const expected = [];
    const actual = getMetadataLines(metadata);
    expect(actual).toEqual(expected);
  });
});
