import { Result } from 'axe-core';

export function terminalLog(violations: Result[]): void {
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
