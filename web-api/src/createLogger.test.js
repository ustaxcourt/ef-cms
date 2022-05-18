const { stringifyMetadata } = require('./createLogger');

describe('stringifyMetadata', () => {
  it('should return info', () => {
    const metadata = Object.assign(
      {},
      { error: 'error', message: 'my message', otherStuff: { stuff: '1' } },
      {
        level: undefined,
        message: undefined,
      },
    );

    // console.log(metadata);
    const actual = stringifyMetadata(metadata);

    expect(actual).toBeFalsy();
  });
});
