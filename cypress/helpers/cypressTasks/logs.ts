import { Result } from 'axe-core';

export function terminalLog(violations: Result[]): void {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`,
  );

  const violationData = violations.map(
    ({ description, id, impact, nodes }) => ({
      description,
      id,
      impact,
      nodes: nodes.length,
    }),
  );

  cy.task('table', violationData);
}
