const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getUsersInSectionInteractor,
} = require('./getUsersInSectionInteractor');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { ROLES } = require('../../entities/EntityConstants');

const MOCK_SECTION = [
  {
    name: 'Test Petitioner 1',
    role: ROLES.petitioner,
    userId: '304a756b-ce23-438a-a9bb-3732c6a439b7',
  },
  {
    name: 'Test Petitioner 2',
    role: ROLES.petitioner,
    userId: 'a79d2fac-aa2c-4183-9877-01ab1cdff127',
  },
];

const MOCK_JUDGE_SECTION = [
  {
    name: 'Test Judge 1',
    role: ROLES.judge,
    userId: 'ce5add74-1559-448d-a67d-c887c8351b2e',
  },
  {
    name: 'Test Judge 2',
    role: ROLES.judge,
    userId: 'ea83cea2-5ce9-451d-b3d6-1e7c0e51d311',
  },
];

describe('Get users in section', () => {
  it('retrieves the users in the petitions section', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '5a797be2-a4b7-469f-9cfb-32b7f169d489',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    const sectionToGet = { section: 'petitions' };
    const section = await getUsersInSectionInteractor({
      applicationContext,
      sectionToGet,
    });
    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Test Petitioner 1');
  });

  it('returns notfounderror when section not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '5a797be2-a4b7-469f-9cfb-32b7f169d489',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorizederror when user not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '5a797be2-a4b7-469f-9cfb-32b7f169d489',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);

    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('retrieves the users in the judge section when the current user has the appropriate permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '5a797be2-a4b7-469f-9cfb-32b7f169d489',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    const section = await getUsersInSectionInteractor({
      applicationContext,
      sectionToGet,
    });
    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Test Judge 1');
  });

  it('returns unauthorizederror when the desired section is judge and current user does not have appropriate permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '5a797be2-a4b7-469f-9cfb-32b7f169d489',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    await expect(
      getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
