describe('Health check', () => {
  const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

  if (!SMOKETESTS_LOCAL) {
    it("should retrieve the status of the application's critical services", () => {
      const domain = Cypress.env('EFCMS_DOMAIN');
      const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

      cy.request({
        followRedirect: true,
        method: 'GET',
        url: `https://public-api-${DEPLOYING_COLOR}.${domain}/public-api/health`,
      }).should(response => {
        expect(response.body.cognito).to.be.true;
        expect(response.body.dynamo.efcms).to.be.true;
        expect(response.body.dynamo.efcmsDeploy).to.be.true;
        expect(response.body.dynamsoft).to.be.true;
        expect(response.body.elasticsearch).to.be.true;
        expect(response.body.emailService).to.be.true;
        expect(response.body.s3.app).to.be.true;
        expect(response.body.s3.appFailover).to.be.true;
        expect(response.body.s3.eastDocuments).to.be.true;
        expect(response.body.s3.eastTempDocuments).to.be.true;
        expect(response.body.s3.eastQuarantine).to.be.true;
        expect(response.body.s3.public).to.be.true;
        expect(response.body.s3.publicFailover).to.be.true;
        expect(response.body.s3.westDocuments).to.be.true;
        expect(response.body.s3.westTempDocuments).to.be.true;
        expect(response.body.s3.westQuarantine).to.be.true;
      });
    });
  }
});
