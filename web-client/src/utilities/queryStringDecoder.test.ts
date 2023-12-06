import { queryStringDecoder } from './queryStringDecoder';

describe('queryStringDecoder', () => {
  beforeAll(() => {
    delete window.location;
  });

  it('should return code, path, and token from hash', () => {
    window.location = {
      hash: '#id_token=ID_TOKEN',
      search: '?code=CODE&token=TOKEN&path=BoulevardOfBrokenMemes',
    };

    const result = queryStringDecoder();

    expect(result.code).toEqual('CODE');
    expect(result.path).toEqual('BoulevardOfBrokenMemes');
    expect(result.token).toEqual('ID_TOKEN');
  });

  it('should return code and token from query with a default path of /', () => {
    window.location = {
      search: '?code=CODE&token=TOKEN',
    };

    const result = queryStringDecoder();

    expect(result.code).toEqual('CODE');
    expect(result.path).toEqual('/');
    expect(result.token).toEqual('TOKEN');
  });
});
