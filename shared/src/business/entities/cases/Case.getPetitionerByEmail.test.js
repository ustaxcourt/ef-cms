const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getPetitionerByEmail', () => {
  const mockContactEmail = 'petitioner@example.com';

  it('returns petitioner with matching email from petitioners array', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });
    expect(myCase.getPetitionerByEmail(mockContactEmail)).toBeDefined();
  });

  it('returns undefined if matching petitioner is not found', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });

    expect(myCase.getPetitionerByEmail('nobody@example.com')).toBeUndefined();
  });
});
