import type {
  PublicDataValidationResult,
  UnauthorizedFieldFinding,
} from '../../helpers/cypressTasks/network/assertCorrectNetworkData';
import '../../support/commands/keepAliases';
import 'cypress-file-upload';

export type CapturedNetworkPayload = {
  url: string;
  method: string;
  requestBody?: unknown;
  responseBody?: unknown;
  requestHeaders?: Record<string, unknown>;
  responseHeaders?: Record<string, unknown>;
};

const capturedNetworkPayloads: CapturedNetworkPayload[] = [];

const PUBLIC_APP_HOST = 'localhost:5678';

function getHeaderValue(
  headers: Record<string, unknown> | undefined,
  headerName: string,
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const matchingKey = Object.keys(headers).find(
    key => key.toLowerCase() === headerName,
  );

  if (!matchingKey) {
    return undefined;
  }

  const value = headers[matchingKey];
  return typeof value === 'string' ? value : undefined;
}

function isPublicOriginRequest(req: {
  url: string;
  headers: Record<string, unknown>;
}): boolean {
  if (req.url.includes(PUBLIC_APP_HOST)) {
    return true;
  }

  const referer = getHeaderValue(req.headers, 'referer');
  if (referer?.includes(PUBLIC_APP_HOST)) {
    return true;
  }

  const origin = getHeaderValue(req.headers, 'origin');
  return origin?.includes(PUBLIC_APP_HOST) ?? false;
}

Cypress.Commands.add('capturePublicPageNetworkTraffic', () => {
  capturedNetworkPayloads.length = 0;

  cy.intercept(
    {
      url: '**',
      middleware: true,
    },
    req => {
      req.on('response', res => {
        // Include only requests that originated from the public site
        if (isPublicOriginRequest(req)) {
          capturedNetworkPayloads.push({
            url: req.url,
            method: req.method,
            requestBody: req.body,
            responseBody: res.body,
            requestHeaders: req.headers,
            responseHeaders: res.headers,
          });
        }
      });

      // Intentionally do not call req.continue(); calling it in middleware short-circuits later intercept handlers
    },
  );

  return cy.wrap(capturedNetworkPayloads, { log: false });
});

Cypress.Commands.add('assertCorrectNetworkData', () => {
  return cy
    .task<PublicDataValidationResult>(
      'assertCorrectNetworkData',
      capturedNetworkPayloads,
      {
        log: false,
      },
    )
    .then(result => {
      if (result.passed) {
        Cypress.log({
          name: 'network scan',
          message: 'passed',
        });

        return;
      }

      const message = formatSensitiveNetworkFailure(result.findings);

      Cypress.log({
        name: 'network scan',
        message: `${result.findings.length} finding(s)`,
        consoleProps: () => ({
          findings: result.findings,
        }),
      });

      throw new Error(message);
    });
});

Cypress.Commands.add('showsErrorMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert-error').should('exist');
  } else {
    cy.get('.usa-alert-error').should('not.exist');
  }
});

Cypress.Commands.add('showsSpinner', (shows = true) => {
  if (shows) {
    cy.get('.progress-indicator').should('exist');
  } else {
    cy.get('.progress-indicator').should('not.exist');
  }
});

Cypress.Commands.add('showsSuccessMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert--success').should('exist');
  } else {
    cy.get('.usa-alert--success').should('not.exist');
  }
});

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    w.__cy_route(...args);
  });
});

Cypress.Commands.add('waitUntilSettled', (maxTries = 20) => {
  let didDOMChange = false;
  let consecutiveIdleCallbacksWithUnchangedDOM = 0;

  const handleMutation = () => {
    didDOMChange = true;
  };

  const observer = new MutationObserver(handleMutation);

  cy.document().then(doc => {
    observer.observe(doc.body, { childList: true, subtree: true });
  });

  /**
   *
   */
  function waitAndSee(iteration: number) {
    didDOMChange = false;

    const thenTimeout = 8000;

    cy.window({ log: false })
      .then(
        { timeout: thenTimeout },
        win =>
          new Cypress.Promise(resolve =>
            win.requestIdleCallback(resolve, { timeout: thenTimeout / 2 }),
          ),
      )
      .then(() => {
        if (didDOMChange) {
          if (iteration >= maxTries) {
            throw new Error('DOM did not settle');
          }

          consecutiveIdleCallbacksWithUnchangedDOM = 0;
          waitAndSee(iteration + 1);
        } else if (consecutiveIdleCallbacksWithUnchangedDOM <= 1) {
          consecutiveIdleCallbacksWithUnchangedDOM += 1;
          waitAndSee(iteration);
        }
      });
  }

  waitAndSee(0);
});

export {};
declare global {
  namespace Cypress {
    interface Chainable {
      assertCorrectNetworkData(): Chainable<PublicDataValidationResult>;
      capturePublicPageNetworkTraffic(): Chainable<CapturedNetworkPayload[]>;
      goToRoute: (args: any) => void;
      keepAliases: (args?: string[]) => void;
      showsErrorMessage: (shows?: boolean) => void;
      showsSpinner: (shows?: boolean) => void;
      showsSuccessMessage: (shows?: boolean) => void;
      waitAndSee: (iteration: number) => void;
      waitUntilSettled: (maxTries?: number) => void;
    }
  }
}

function formatSensitiveNetworkFailure(
  findings: UnauthorizedFieldFinding[],
): string {
  const groupedByUrl = findings.reduce<
    Record<string, UnauthorizedFieldFinding[]>
  >((acc, finding) => {
    const key = `${finding.method} ${finding.url}`;
    acc[key] ??= [];
    acc[key].push(finding);
    return acc;
  }, {});

  const details = Object.entries(groupedByUrl)
    .map(([request, requestFindings]) => {
      const findingLines = requestFindings
        .map(
          finding =>
            `    - ${finding.fieldName} in ${finding.location}: ${finding.matchPreview}`,
        )
        .join('\n');

      return `  ${request}\n${findingLines}`;
    })
    .join('\n\n');

  return [
    'Expected public page network traffic to contain only public data',
    '',
    `Found ${findings.length} issue(s):`,
    '',
    details,
    '',
    'To fix this, remove the non-public value from the public-page request/response or the expected public entity to the validator function.',
  ].join('\n');
}
