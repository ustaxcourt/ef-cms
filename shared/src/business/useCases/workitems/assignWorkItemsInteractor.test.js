const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} = require('../../entities/EntityConstants');
const { assignWorkItemsInteractor } = require('./assignWorkItemsInteractor');
const { omit } = require('lodash');

describe('assignWorkItemsInteractor', () => {
  const MOCK_WORK_ITEM = {
    assigneeId: null,
    assigneeName: 'bob',
    caseStatus: CASE_STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:06:02.971Z',
    docketEntry: {
      createdAt: '2018-12-27T18:06:02.968Z',
      docketEntryId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: 'Stipulated Decision',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Test Respondent',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Stipulated Decision filed by respondent is ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        to: null,
        userId: 'irsPractitioner',
      },
    ],
    section: DOCKET_SECTION,
    sentBy: 'irsPractitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  };

  it('unauthorized user tries to assign a work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'baduser',
    });

    await expect(
      assignWorkItemsInteractor(applicationContext),
    ).rejects.toThrow();
  });

  it('fail on validation if the work items provided are invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(omit(MOCK_WORK_ITEM, 'docketNumber'));

    await expect(
      assignWorkItemsInteractor(applicationContext, {
        userId: 'docketclerk',
      }),
    ).rejects.toThrow();
  });
});
