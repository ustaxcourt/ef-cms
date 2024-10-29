const mockSearchClient = {
  search: jest.fn(() =>
    console.debug('search was not implemented, using default mock'),
  ),
};

jest.mock(
  '@web-api/persistence/elasticsearch/searchClient/getSearchClient',
  () => ({
    getSearchClient: () => mockSearchClient,
  }),
);
