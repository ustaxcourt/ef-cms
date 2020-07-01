const {
  getCaseByDocketNumberInteractor,
} = require('./getCaseByDocketNumberInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';

describe('Get case by docket number', () => {
  it('success case by case id', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));

    const caseRecord = await getCaseByDocketNumberInteractor({
      applicationContext,
      docketNumber: '123-19',
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('throws a NotFoundError if case by docket number is not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      getCaseByDocketNumberInteractor({
        applicationContext,
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found');
  });
});
