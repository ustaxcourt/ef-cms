import { DOCKET_SECTION, ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getDocumentQCInboxForSectionInteractor } from './getDocumentQCForSectionInteractor';

describe('getDocumentQCInboxForSectionInteractor', () => {
  it('should throw an error when the user does not have permission to retrieve work items', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getDocumentQCInboxForSectionInteractor(applicationContext, {
        section: DOCKET_SECTION,
      }),
    ).rejects.toThrow();
  });

  it('should query workItems for the provided section', async () => {
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

  it('should default to query workItems for the DOCKET_SECTION when a section is provided that is NOT PETITIONS_SECTION', async () => {
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

  it('should query workItems using a judge name when one is provided', async () => {
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
        .mock.calls[0][0].judgeUserName,
    ).toEqual('Ashford');
  });
});
