const { applicationContext } = require('../test/createTestApplicationContext');
const { copyPagesFromPdf } = require('./copyPagesFromPdf');
const { ROLES } = require('../entities/EntityConstants');

describe('copyPagesFromPdf', () => {
  it('should generate a bar number and userId when they are not provided', async () => {
    expect(result.barNumber).not.toBeUndefined();
    expect(result.userId).not.toBeUndefined();
  });
});
