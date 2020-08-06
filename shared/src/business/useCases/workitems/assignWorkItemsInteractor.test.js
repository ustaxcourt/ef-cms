const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} = require('../../entities/EntityConstants');
const { assignWorkItemsInteractor } = require('./assignWorkItemsInteractor');
const { omit } = require('lodash');
const { ROLES } = require('../../entities/EntityConstants');

const MOCK_WORK_ITEM = {
  assigneeId: null,
  assigneeName: 'bob',
  caseStatus: CASE_STATUS_TYPES.generalDocket,
  createdAt: '2018-12-27T18:06:02.971Z',
  docketNumber: '101-18',
  docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
  document: {
    createdAt: '2018-12-27T18:06:02.968Z',
    documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
    documentType: 'Stipulated Decision',
  },
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
  section: 'docket',
  sentBy: 'irsPractitioner',
  updatedAt: '2018-12-27T18:06:02.968Z',
  workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
};

describe('assignWorkItemsInteractor', () => {
  it('unauthorized user tries to assign a work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'baduser',
    });
    let error;
    try {
      await assignWorkItemsInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('fail on validation if the work items provided are invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(omit(MOCK_WORK_ITEM, 'docketNumber'));

    applicationContext.user = {
      name: 'bob',
      role: ROLES.petitionsClerk,
    };
    let error;
    try {
      await assignWorkItemsInteractor({
        applicationContext,
        userId: 'docketclerk',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
