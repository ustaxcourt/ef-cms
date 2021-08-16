describe('Public UI Smoketests', () => {
  describe('todays opinions', () => {
    it('should fetch today opinions from the public api', () => {
      cy.intercept({ method: 'GET', url: '**/public-api/todays-opinions' }).as(
        'getTodaysOpinions',
      );
      cy.visit('/todays-opinions');
      cy.wait('@getTodaysOpinions').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });
});
