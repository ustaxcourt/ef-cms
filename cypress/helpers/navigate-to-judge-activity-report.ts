export function navigateToJudgeActivityReport(
  tab: 'submitted-and-cav' | 'pending-motions' | 'statistics',
) {
  cy.get('[data-testid="dropdown-select-report"]').click();
  cy.get('[data-testid="activity-report-link"]').click();
  cy.get(`[data-testid="${tab}-tab"]`).click();
}
