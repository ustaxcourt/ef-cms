const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getInboxMessagesForSectionInteractor,
} = require('./getInboxMessagesForSectionInteractor');
const { User } = require('../../entities/User');

describe('getInboxMessagesForSectionInteractor', () => {
  const mockPetitionsClerk = {
    role: User.ROLES.petitionsClerk,
    userId: 'petitionsClerk',
  };

  let getInboxMessagesForSectionStub;
  let validateRawCollectionStub;

  beforeEach(() => {
    getInboxMessagesForSectionStub = jest.fn();
    validateRawCollectionStub = jest.fn();

    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    applicationContext.getEntityConstructors = () => ({
      WorkItem: {
        validateRawCollection: validateRawCollectionStub,
      },
    });

    applicationContext
      .getPersistenceGateway()
      .getInboxMessagesForSection.mockReturnValue(
        getInboxMessagesForSectionStub,
      );
  });

  it('gets inbox messages for a section', async () => {
    await getInboxMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(
      applicationContext.getPersistenceGateway().getInboxMessagesForSection,
    ).toHaveBeenCalled();
    expect(validateRawCollectionStub).toHaveBeenCalled();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    let error;
    try {
      await getInboxMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
