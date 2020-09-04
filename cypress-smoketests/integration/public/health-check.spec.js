describe('Health check', () => {
  it("should retrieve the status of the application's critial services", () => {
    cy.request({
      followRedirect: true,
      method: 'GET',
      url: 'https://public-api.dev.ustc-case-mgmt.flexion.us/public-api/health',
    }).should(response => {
      console.log(response.body);
      expect(response.body).to.have.property('clamAV');
      expect(response.body).to.have.property('cognito');
      expect(response.body).to.have.property('dynamsoft');
      expect(response.body).to.have.property('elasticsearch');
      expect(response.body).to.have.property('emailService');
      expect(response.body).to.have.property('s3');
      expect(response.body).to.have.property('dynamo');
      expect(response.body.dynamo).to.have.property('efcms');
      expect(response.body.dynamo).to.have.property('efcmsDeploy');
      expect(response.body.s3).to.have.property('app');
      expect(response.body.s3).to.have.property('westTempDocuments');
      expect(response.body.s3).to.have.property('westDocuments');
      expect(response.body.s3).to.have.property('publicFailover');
      expect(response.body.s3).to.have.property('public');
      expect(response.body.s3).to.have.property('eastTempDocuments');
      expect(response.body.s3).to.have.property('eastDocuments');
      expect(response.body.s3).to.have.property('appFailover');
    });
  });
});
