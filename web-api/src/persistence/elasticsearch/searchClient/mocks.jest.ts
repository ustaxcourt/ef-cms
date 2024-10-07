import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/elasticsearch/searchClient/getSearchClient',
  () => mockFactory('getSearchClient'),
);
