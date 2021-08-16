describe('Public UI Smoketests', () => {
  describe('todays orders', () => {
    it('should fetch today orders from the public api', () => {
      cy.intercept({ method: 'GET', url: '**/public-api/todays-orders/**' }).as(
        'getTodaysOrders',
      );
      cy.visit('/todays-orders');
      cy.wait('@getTodaysOrders').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });
});
