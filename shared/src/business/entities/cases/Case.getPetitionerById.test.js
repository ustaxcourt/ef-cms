const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case, getContactPrimary } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getPetitionerById', () => {
  it('returns petitioner with matching contactId from petitioners array', () => {
    const mockContactId = 'b0690ccb-a94b-453f-8d6b-45775658f559';

    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          { ...getContactPrimary(MOCK_CASE), contactId: mockContactId },
        ],
      },
      { applicationContext },
    );

    expect(myCase.getPetitionerById(mockContactId)).toBeDefined();
  });

  it('returns undefined if matching petitioner is not found', () => {
    const mockNonExistingContactId = '6d23e903-69e2-4c87-a5a3-d127cdd44ce8';

    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: 'ddd26f7e-06dc-4fab-8b12-2f83d64d8dce',
          },
        ],
      },
      { applicationContext },
    );

    expect(myCase.getPetitionerById(mockNonExistingContactId)).toBeUndefined();
  });
});
