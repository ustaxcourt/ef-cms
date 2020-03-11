const {
  getInboxMessagesForSectionInteractor,
} = require('./getInboxMessagesForSectionInteractor');
const { User } = require('../../entities/User');

describe('getInboxMessagesForSectionInteractor', () => {
  let applicationContext;
  let getInboxMessagesForSectionStub;
  let validateRawCollectionStub;

  beforeEach(() => {
    getInboxMessagesForSectionStub = jest.fn();
    validateRawCollectionStub = jest.fn();

    applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsClerk',
        };
      },
      getEntityConstructors: () => ({
        WorkItem: {
          validateRawCollection: validateRawCollectionStub,
        },
      }),
      getPersistenceGateway: () => ({
        getInboxMessagesForSection: getInboxMessagesForSectionStub,
      }),
    };
  });

  it('gets inbox messages for a section', async () => {
    await getInboxMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(getInboxMessagesForSectionStub).toHaveBeenCalled();
    expect(validateRawCollectionStub).toHaveBeenCalled();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
    };

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
