const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('./getDocumentQCInboxForSectionInteractor');

describe('getDocumentQCInboxForSectionInteractor', () => {
  let mockWorkItem = {
    createdAt: '',
    docketEntry: {
      sentBy: 'petitioner',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [],
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCServedForSection.mockResolvedValue(mockWorkItem);

    let error;
    try {
      await getDocumentQCInboxForSectionInteractor({
        applicationContext,
        section: DOCKET_SECTION,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
