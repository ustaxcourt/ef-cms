import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForSectionInteractor } from './getDocumentQCInboxForSectionInteractor';
import {
  mockDocketClerkUser,
  mockJudgeUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getDocumentQCInboxForSectionInteractor', () => {
  it('should throw an error when the user does not have permission to retrieve work items', async () => {
    await expect(
      getDocumentQCInboxForSectionInteractor(
        applicationContext,
        {
          section: DOCKET_SECTION,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow();
  });

  it('should query workItems for the provided section', async () => {
    await getDocumentQCInboxForSectionInteractor(
      applicationContext,
      {
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(DOCKET_SECTION);
  });

  it('should default to query workItems for the DOCKET_SECTION when a section is provided that is NOT PETITIONS_SECTION', async () => {
    await getDocumentQCInboxForSectionInteractor(
      applicationContext,
      {
        section: 'ANY_OTHER_SECTION',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].section,
    ).toEqual(DOCKET_SECTION);
  });

  it('should query workItems using a judge name when one is provided', async () => {
    await getDocumentQCInboxForSectionInteractor(
      applicationContext,
      {
        judgeUserName: 'Ashford',
        section: applicationContext.getPersistenceGateway().getJudgesChambers()
          .ASHFORDS_CHAMBERS_SECTION.section,
      },
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForSection
        .mock.calls[0][0].judgeUserName,
    ).toEqual('Ashford');
  });
});
