describe('Reconciliation report', () => {
  it('should retrieve all items served on the IRS (indicated by servedParty of R or B) on a specific day (12:00am-11:59:59pm ET)', () => {
    cy.request({
      followRedirect: true,
      headers: {
        authorization: 'Bearer irsSuperuser@example.com',
      },
      method: 'GET',
      url: 'http://localhost:4000/v2/reconciliation-report/2020-09-25',
    }).should(response => {
      console.log('response!', response);
      expect(response.body.docketEntries).to.be.true;
      expect(response.body.reconciliationDate).to.be.true;
      expect(response.body.reportTitle).to.be.true;
      expect(response.body.totalDocketEntries).to.be.true;
    });
  });
});
