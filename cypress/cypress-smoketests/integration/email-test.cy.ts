describe('TEST', () => {
  before(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  after(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  const UNIQUE_TIMESTAMP = Date.now();
  const TEST_EMAIL = `testemail+${UNIQUE_TIMESTAMP}@exp3.ustc-case-mgmt.flexion.us`;

  it('should TEST', () => {
    console.log('TEST_EMAIL', TEST_EMAIL);
    //create account
    //get all items from bucket
    //assert there is one item
    //assert the content of that item contains our unique email
  });
});
