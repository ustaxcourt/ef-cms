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
        statusCode: 200,
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

  it('rejects unsupported scalar payloads and primitive entity collection items', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        statusCode: 200,
        responseBody: JSON.stringify({ privateField: 'do-not-leak' }),
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/serialized',
      },
      {
        method: 'GET',
        statusCode: 200,
        responseBody: ['synthetic-private-value'],
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/users',
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldName: 'response' }),
        expect.objectContaining({ fieldName: '[0]' }),
      ]),
    );
  });

  it('validates approved public scalar responses and feature flags on public API hosts', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        statusCode: 200,
        responseBody: false,
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: 'http://localhost:4001/public-api/maintenance-mode',
      },
      {
        method: 'GET',
        statusCode: 200,
        responseBody: {
          entityName: 'FeatureFlagResponseDTO',
          'enable-payment-portal-integration': true,
        },
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: 'https://public-api-blue.example.gov/system/feature-flag',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
  });

  it('does not validate public error responses', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'GET',
        statusCode: 404,
        responseBody: 'Case not found',
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/cases/not-found',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
  });

  it('does not validate bodyless HEAD responses', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'HEAD',
        statusCode: 200,
        responseBody: '',
        responseHeaders: {
          'content-type': 'application/json',
        },
        url: '/public-api/cases/103-20',
      },
    ]);

    expect(result).toEqual({
      passed: true,
      findings: [],
    });
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
