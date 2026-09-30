/**
 * Skips the current suite when `enable-payment-portal-integration` is false in Postgres
 * (`dw_feature_flag`). Use in a root `before()` hook for payment-portal Cypress specs.
 */
export function skipUnlessPaymentPortalIntegrationEnabled(
  this: Mocha.Context,
): void {
  cy.task('getRawFeatureFlagValue', {
    flag: 'enable-payment-portal-integration',
  }).then(enablePaymentPortalIntegration => {
    if (!enablePaymentPortalIntegration) {
      this.skip();
    }
  });
}
