describe('Public docket-entry disposition relationships', () => {
  it('preserves granted relationships in the public response', () => {
    cy.intercept('GET', '/public-api/cases/999-15/docket-entries?page=0').as(
      'getGrantedDocketEntries',
    );

    cy.visit('/case-detail/999-15');

    cy.wait('@getGrantedDocketEntries').then(({ response }) => {
      expect(response?.statusCode).to.equal(200);
      expect(
        response?.body.docketEntries.find(
          ({ docketEntryId }) =>
            docketEntryId === '6d83425c-8ef3-4c66-b776-6c7957c53f4d',
        )?.affectedDocketEntries,
      ).to.deep.include({
        docketEntryId: '15b5ee1c-2cf7-4ca3-afb2-e82b39a92ac5',
        disposition: 'GRANTED',
        entityName: 'DocketEntry',
      });
      expect(
        response?.body.docketEntries.find(
          ({ docketEntryId }) =>
            docketEntryId === '15b5ee1c-2cf7-4ca3-afb2-e82b39a92ac5',
        )?.affectedByDocketEntries,
      ).to.deep.include({
        docketEntryId: '6d83425c-8ef3-4c66-b776-6c7957c53f4d',
        disposition: 'GRANTED',
        entityName: 'DocketEntry',
      });
    });
  });

  it('preserves denied relationships in the public response', () => {
    cy.intercept('GET', '/public-api/cases/103-20/docket-entries?page=0').as(
      'getDeniedDocketEntries',
    );

    cy.visit('/case-detail/103-20');

    cy.wait('@getDeniedDocketEntries').then(({ response }) => {
      expect(response?.statusCode).to.equal(200);
      expect(
        response?.body.docketEntries.find(
          ({ docketEntryId }) =>
            docketEntryId === '9a802625-124a-4a2d-b9a0-3c065b9d14f7',
        )?.affectedDocketEntries,
      ).to.deep.include({
        docketEntryId: '8c05d0c0-482a-4f69-bfdd-84dbbc873651',
        disposition: 'DENIED',
        entityName: 'DocketEntry',
      });
      expect(
        response?.body.docketEntries.find(
          ({ docketEntryId }) =>
            docketEntryId === '8c05d0c0-482a-4f69-bfdd-84dbbc873651',
        )?.affectedByDocketEntries,
      ).to.deep.include({
        docketEntryId: '9a802625-124a-4a2d-b9a0-3c065b9d14f7',
        disposition: 'DENIED',
        entityName: 'DocketEntry',
      });
    });
  });
});
