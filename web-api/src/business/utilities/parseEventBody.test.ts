import { parseEventBody } from '@web-api/business/utilities/parseEventBody';

describe('parseEventBody', () => {
  it('should parse an event body into a fresh object', () => {
    const body = {
      foo: 1,
      bar: '1',
      fooList: [1, 2, 3],
      barObj: {
        foo: 1,
        bar: '1',
      },
    };
    const result = parseEventBody(body);
    expect(result).toEqual(body);
  });

  it('should handle empty objects', () => {
    const body = {};
    const result = parseEventBody(body);
    expect(result).toEqual(body);
  });
});
