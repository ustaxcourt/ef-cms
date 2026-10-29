import { assertCorrectNetworkData } from '../../../cypress/helpers/cypressTasks/network/assertCorrectNetworkData';

describe('assertCorrectNetworkData', () => {
  it('does not treat public API request bodies as response entities', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'POST',
        requestBody: {
          entityName: 'PublicUser',
          name: 'Test User',
          privateField: 'request-only',
          role: 'petitioner',
        },
        requestHeaders: {
          'content-type': 'application/json',
        },
        responseBody: {
          entityName: 'PublicUser',
          name: 'Test User',
          role: 'petitioner',
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/cases/101-20/generate-docket-record',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
  });

  it('continues to report unauthorized fields in public API responses', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        responseBody: {
          entityName: 'PublicUser',
          name: 'Test User',
          privateField: 'do-not-leak',
          role: 'petitioner',
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/users',
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.findings).toEqual([
      expect.objectContaining({
        fieldName: 'privateField',
        location: 'responseBody',
        method: 'GET',
      }),
    ]);
  });

  it('allows serialized public entity arrays and approved response wrappers', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        responseBody: [
          {
            entityName: 'PublicUser',
            name: 'Test User',
            role: 'petitioner',
          },
          {
            entityName: 'PublicUser',
            name: 'Another User',
            role: 'petitioner',
          },
        ],
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/users',
      },
      {
        method: 'GET',
        responseBody: {
          results: [],
          totalCount: 0,
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/search',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
  });

  it('reports unauthorized fields nested in a public entity array response', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        responseBody: {
          results: [
            {
              entityName: 'PublicDocumentSearchResult',
              privateField: 'do-not-leak',
            },
          ],
          totalCount: 1,
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: 'https://public-api-blue.example.gov/public-api/order-search',
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.findings).toEqual([
      expect.objectContaining({
        fieldName: 'results[0].privateField',
        location: 'responseBody',
        method: 'GET',
        url: 'https://public-api-blue.example.gov/public-api/order-search',
      }),
    ]);
  });

  it('ignores non-public, non-JSON, and static-asset responses', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        responseBody: undefined,
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/health',
      },
      {
        method: 'GET',
        responseBody: {
          entityName: 'PrivateMessage',
          privateField: 'private endpoint data',
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/messages/inbox/123',
      },
      {
        method: 'GET',
        responseBody: { privateField: 'binary response' },
        responseHeaders: {
          'content-type': 'application/pdf',
        },
        url: '/public-api/document',
      },
      {
        method: 'GET',
        responseBody: { privateField: 'asset response' },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/assets/logo.svg',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
  });
});
