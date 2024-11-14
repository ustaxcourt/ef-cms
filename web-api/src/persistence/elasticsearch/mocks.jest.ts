import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/elasticsearch/getCasesByFilters', () =>
  mockFactory('getCasesByFilters'),
);
