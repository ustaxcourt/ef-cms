import { parseEventBody } from '@web-api/business/utilities/parseEventBody';

describe('parseEventBody', () => {
  it('should parse an event body into an object with a null prototype', () => {
    const body =
      '{"foo":1,"bar":"1","fooList":[1,2,3],"barObj":{"foo":1,"bar":"1"}}';
    const result = parseEventBody(body);
    expect(result).toEqual({
      foo: 1,
      bar: '1',
      fooList: [1, 2, 3],
      barObj: {
        foo: 1,
        bar: '1',
      },
    });
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it('should handle empty objects', () => {
    const body = '{}';
    const result = parseEventBody(body);
    expect(result).toEqual({});
    expect(Object.getPrototypeOf(result)).toBeNull();
  });
});
