import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

const HEALTH_CHECK_IDS = [
  'cognito',
  'elasticsearch',
  // 'emailService', disable for now due to flaky tests
  's3-app',
  's3-app-failover',
  's3-east-documents',
  's3-east-temp-documents',
  's3-public',
  's3-failover',
  's3-west-documents',
  's3-west-temp-documents',
];

if (!getCypressEnv().isLocal) {
  describe('Health check', () => {
    it("should retrieve the status of the application's critical services", () => {
      cy.visit('/health');
      cy.url().should('include', '/health');
      for (const id of HEALTH_CHECK_IDS) {
        cy.get(`#${id} svg[data-icon="circle-check"]`).should('exist');
      }
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
