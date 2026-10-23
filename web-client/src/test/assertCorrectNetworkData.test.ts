import { assertCorrectNetworkData } from '../../../cypress/helpers/cypressTasks/network/assertCorrectNetworkData';

describe('assertCorrectNetworkData', () => {
  it('does not treat public API request bodies as response entities', () => {
    const result = assertCorrectNetworkData([
      {
        method: 'POST',
        requestBody: {
          docketNumber: '101-20',
          docketRecordTableSort: [],
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
});
