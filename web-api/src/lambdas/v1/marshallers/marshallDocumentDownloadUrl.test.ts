import { marshallDocumentDownloadUrl } from './marshallDocumentDownloadUrl';
const MOCK_URL = {
  url: 'https://example.com/path?queryparam=passed',
};

describe('marshallDocumentDownloadUrl', () => {
  it('returns a url object with the expected properties', () => {
    expect(Object.keys(marshallDocumentDownloadUrl(MOCK_URL)).sort()).toEqual([
      'url',
    ]);
  });

  it('marshalls from the current url format', () => {
    expect(MOCK_URL.url).toBeDefined();

    const marshalled = marshallDocumentDownloadUrl(MOCK_URL);

    expect(marshalled.url).toEqual(MOCK_URL.url);
  });
});
