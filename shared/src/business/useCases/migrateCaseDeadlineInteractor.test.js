const {
  migrateCaseDeadlineInteractor,
} = require('./migrateCaseDeadlineInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

const DATE = '2018-11-21T20:49:28.192Z';

let adminUser;
let createdCaseDeadlines;
let caseDeadlineMetadata;

describe('migrateCaseDeadlineInteractor', () => {
  beforeEach(() => {
    window.Date.prototype.toISOString = jest.fn(() => DATE);

    adminUser = new User({
      name: 'Joe Exotic',
      role: ROLES.admin,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    createdCaseDeadlines = [];

    applicationContext.environment.stage = 'local';

    applicationContext.getCurrentUser.mockImplementation(() => adminUser);

    applicationContext
      .getPersistenceGateway()
      .createCaseDeadline.mockImplementation(({ caseDeadlineToCreate }) => {
        createdCaseDeadlines.push(caseDeadlineToCreate);
      });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...adminUser,
      section: 'admin',
    });

    applicationContext.getUseCases().getUserInteractor.mockReturnValue({
      name: 'john doe',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    caseDeadlineMetadata = {
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'One small step',
      docketNumber: '999-96',
    };
  });

  it('should get the current user from applicationContext', async () => {
    await migrateCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineMetadata,
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      migrateCaseDeadlineInteractor({
        applicationContext,
        caseDeadlineMetadata,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should pull the current user record from persistence', async () => {
    await migrateCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineMetadata,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalled();
  });

  it('should create a case deadline successfully', async () => {
    expect(createdCaseDeadlines.length).toEqual(0);

    const result = await migrateCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineMetadata,
    });

    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline,
    ).toHaveBeenCalled();
    expect(createdCaseDeadlines.length).toEqual(1);

    const secondResult = await migrateCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineMetadata: {
        caseDeadlineId: 'ad1e1b24-f3c4-47b4-b10e-76d1d050b2ab',
        createdAt: '2020-01-01T01:02:15.185-04:00',
        deadlineDate: '2020-01-24T00:00:00.000-05:00',
        description: 'Due date migrated from Blackstone',
        docketNumber: '15925-10',
        entityName: 'CaseDeadline',
      },
    });

    expect(secondResult).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline,
    ).toHaveBeenCalled();
    expect(createdCaseDeadlines.length).toEqual(2);
  });

  describe('validation', () => {
    it('should fail to migrate a case deadline when the case deadline metadata is invalid', async () => {
      await expect(
        migrateCaseDeadlineInteractor({
          applicationContext,
          caseDeadlineMetadata: {},
        }),
      ).rejects.toThrow('The CaseDeadline entity was invalid');
    });

    it('should fail to migrate a case deadline when the description is invalid', async () => {
      await expect(
        migrateCaseDeadlineInteractor({
          applicationContext,
          caseDeadlineMetadata: {
            ...caseDeadlineMetadata,
            description: '',
          },
        }),
      ).rejects.toThrow('The CaseDeadline entity was invalid');
    });
  });
});
