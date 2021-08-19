const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
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
      await getDocumentQCInboxForSectionInteractor(applicationContext, {
        section: DOCKET_SECTION,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('queries workItems for the DOCKET_SECTION when the DOCKET_SECTION is passed', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });

    await getDocumentQCInboxForSectionInteractor(applicationContext, {
      section: DOCKET_SECTION,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(DOCKET_SECTION);
  });

  it('queries workItems for the PETITIONS_SECTION when the PETITIONS_SECTION is passed', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });

    await getDocumentQCInboxForSectionInteractor(applicationContext, {
      section: PETITIONS_SECTION,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(PETITIONS_SECTION);
  });

  it('queries workItems for the DOCKET_SECTION when any other section is passed', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });

    await getDocumentQCInboxForSectionInteractor(applicationContext, {
      section: 'ANY_OTHER_SECTION',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(DOCKET_SECTION);
  });

  it('queries workItems for the DOCKET_SECTION with a judgeUserName', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.judge,
      userId: 'judge',
    });

    await getDocumentQCInboxForSectionInteractor(applicationContext, {
      judgeUserName: 'Ashford',
      section: applicationContext.getPersistenceGateway().getJudgesChambers()
        .ASHFORDS_CHAMBERS_SECTION.section,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(DOCKET_SECTION);
    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].judgeUserName,
    ).toEqual('Ashford');
  });
});
