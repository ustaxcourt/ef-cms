const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentQCInboxForUserInteractor,
} = require('./getDocumentQCInboxForUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getDocumentQCInboxForUserInteractor', () => {
  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext.getPersistenceGateway().getDocumentQCServedForSection = async () =>
      mockWorkItem;

    let error;
    try {
      await getDocumentQCInboxForUserInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
