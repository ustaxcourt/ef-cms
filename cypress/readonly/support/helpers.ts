import type { Interception } from 'cypress/types/net-stubbing';
import type { PublicDataValidationResult } from '../../helpers/cypressTasks/network/assertCorrectNetworkData';

export const isValidRequest = ({
  request,
  response,
}: Interception): Cypress.Chainable<void> => {
  if (!response) throw new Error('response was not found');
  expect(response.statusCode).to.eq(200);
  expect(response.headers['content-type']).to.contain('application/json');

  return cy
    .task<PublicDataValidationResult>(
      'assertCorrectNetworkData',
      [
        {
          method: request.method,
          requestBody: request.body,
          requestHeaders: request.headers,
          responseBody: response.body,
          responseHeaders: response.headers,
          url: request.url,
        },
      ],
      { log: false },
    )
    .then(result => {
      const unsafeFields = result.findings
        .map(finding => finding.fieldName)
        .join(', ');
      expect(
        result.passed,
        `Public API response contains unauthorized fields: ${unsafeFields}`,
      ).to.eq(true);
    });
};
